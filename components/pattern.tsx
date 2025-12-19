"use client";

import React from "react";
import styled from "styled-components";
import { cn } from "@/lib/utils";

interface PatternProps {
  className?: string;
  children?: React.ReactNode;
}

const Pattern = ({ className, children }: PatternProps) => {
  return (
    <StyledWrapper className={cn("relative overflow-hidden", className)}>
      {/* Background pattern */}
      <div className="pattern-bg" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.section`
  position: relative;

  .pattern-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    --s: 100px;
    --c1: hsl(var(--background));
    --c2: hsl(var(--primary));
    --c3: hsl(var(--foreground));

    --_g:
      var(--c2) 6% 14%,
      var(--c1) 16% 24%,
      var(--c2) 26% 34%,
      var(--c1) 36% 44%,
      var(--c2) 46% 54%,
      var(--c1) 56% 64%,
      var(--c2) 66% 74%,
      var(--c1) 76% 84%,
      var(--c2) 86% 94%;

    background:
      radial-gradient(
        100% 100% at 100% 0,
        var(--c1) 4%,
        var(--_g),
        color-mix(in srgb, var(--c3) 15%, transparent) 96%,
        transparent
      ),
      radial-gradient(
        100% 100% at 0 100%,
        transparent,
        color-mix(in srgb, var(--c3) 15%, transparent) 4%,
        var(--_g),
        var(--c1) 96%
      )
      var(--c1);

    background-size: var(--s) var(--s);
  }
`;

export default Pattern;
