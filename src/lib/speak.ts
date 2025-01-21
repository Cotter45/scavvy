export function speak({ text }: { text: string }) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser does not support text-to-speech.");
  }
}
