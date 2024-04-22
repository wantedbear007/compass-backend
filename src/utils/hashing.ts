export class CaesarCipher {
  private static readonly alphabet: string = "abcdefghijklmnopqrstuvwxyz";

  static encrypt(text: string, shift: number): string {
    return text
      .toLowerCase()
      .split("")
      .map((char) => {
        const index = CaesarCipher.alphabet.indexOf(char);
        if (index === -1) return char;
        const newIndex = (index + shift) % 26;
        return CaesarCipher.alphabet[newIndex];
      })
      .join("");
  }

  static decrypt(text: string, shift: number): string {
    return CaesarCipher.encrypt(text, 26 - shift);
  }
}
