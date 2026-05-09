type TypewriterEffectProps = {
  sentence: string
}

export function TypewriterEffect({ sentence }: TypewriterEffectProps) {
  /*
   * Interview target:
   * - Render an empty output when a new sentence starts.
   * - Reveal one more character every 500ms.
   * - Stop when the full sentence is visible.
   * - Clear pending timers when sentence changes or the component unmounts.
   */
  return (
    <output className="typewriter-output" data-testid="typewriter-output">
      {sentence}
    </output>
  )
}
