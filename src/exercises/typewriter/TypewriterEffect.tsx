type TypewriterEffectProps = {
  sentence: string
}

export function TypewriterEffect({ sentence }: TypewriterEffectProps) {
  return (
    <output className="typewriter-output" data-testid="typewriter-output">
      {sentence}
    </output>
  )
}
