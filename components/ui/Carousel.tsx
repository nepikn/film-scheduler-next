import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./button";
import { Icons } from "../icons";
import React, { useRef, useState } from "react";

export function Carousel({ children }: { children: React.ReactElement }) {
  // const [emblaRef, emblaApi] = useEmblaCarousel({
  //   slidesToScroll: "auto",
  //   dragFree: true,
  // });

  const viewportRef = useRef<HTMLDivElement>(null);
  const containetRef = useRef<HTMLFieldSetElement>(null);
  const [offset, setOffset] = useState(0);

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center">
      <Button
        variant={"icon"}
        size={"icon"}
        // onClick={() => emblaApi?.scrollPrev()}
        className={"w-8 justify-end"}
        onClick={() =>
          setOffset((o) => {
            const viewportWidth = viewportRef.current!.offsetWidth;
            return Math.min(0, o + viewportWidth);
          })
        }
      >
        <Icons.left />
      </Button>
      <div ref={viewportRef} className="overflow-x-hidden">
        <fieldset
          className={"flex divide-x py-1 transition-transform"}
          ref={containetRef}
          style={{ transform: `translate(${offset}px)` }}
        >
          {children}
        </fieldset>
      </div>
      <Button
        variant={"icon"}
        size={"icon"}
        // onClick={() => emblaApi?.scrollNext()}
        className={"w-8 justify-start"}
        onClick={() =>
          setOffset((o) => {
            const viewportWidth = viewportRef.current!.offsetWidth;
            return Math.max(
              viewportWidth - containetRef.current!.offsetWidth,
              o - viewportWidth,
            );
          })
        }
      >
        <Icons.right />
      </Button>
    </div>
  );
}
