
export function useScrollAnimation(threshold = 0.1) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  })

  return {
    ref,
    className: `transition-all duration-1000 transform ${
      inView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
    }`,
  }
}

