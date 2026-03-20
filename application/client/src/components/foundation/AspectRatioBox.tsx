import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  aspectHeight: number;
  aspectWidth: number;
  children: ReactNode;
}

/**
 * 親要素の横幅を基準にして、指定したアスペクト比のブロック要素を作ります
 */
export const AspectRatioBox = ({ aspectHeight, aspectWidth, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (element == null) {
      return;
    }

    let frameId: number | null = null;
    const calcStyle = () => {
      const clientWidth = element.clientWidth;
      setClientHeight((clientWidth / aspectWidth) * aspectHeight);
      frameId = null;
    };

    const observer = new ResizeObserver(() => {
      if (frameId != null) {
        return;
      }
      frameId = window.requestAnimationFrame(calcStyle);
    });

    observer.observe(element);
    calcStyle();

    return () => {
      observer.disconnect();
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [aspectHeight, aspectWidth]);

  return (
    <div ref={ref} className="relative h-1 w-full" style={{ height: clientHeight }}>
      {/* 高さが計算できるまで render しない */}
      {clientHeight !== 0 ? <div className="absolute inset-0">{children}</div> : null}
    </div>
  );
};
