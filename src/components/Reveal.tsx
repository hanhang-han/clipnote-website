import { useEffect, useRef, ReactNode } from 'react';
import { useReveal } from '../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  id?: string;
}

/**
 * 包装组件：自动注册 IntersectionObserver，元素进入视口时加 visible class
 * 用法：<Reveal as="section" id="xxx" delay={120}>...</Reveal>
 */
export default function Reveal({ children, delay = 0, className = '', as = 'div', id }: RevealProps) {
  const ref = useReveal();
  const Tag = as as any;

  // 应用 delay 到 transition-delay
  useEffect(() => {
    if (delay && ref.current) {
      ref.current.style.transitionDelay = `${delay}ms`;
    }
  }, [delay, ref]);

  return (
    <Tag
      ref={ref as any}
      id={id}
      className={`reveal ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
