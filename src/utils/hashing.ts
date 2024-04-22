export class Hashing {
  static encrypt(text: string, shift: number): string {
    let result = "";

    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      if (char.match(/[a-z]/i)) {
        const code = text.charCodeAt(i);

        // Encrypt uppercase letters
        if (char.toUpperCase() === char) {
          char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        // Encrypt lowercase letters
        else {
          char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }

      result += char;
    }

    return result;
  }

  static decrypt(text: string, shift: number): string {
    return Hashing.encrypt(text, 26 - shift);
  }
}
