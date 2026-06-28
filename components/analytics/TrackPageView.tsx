"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  event: string;
  params?: Record<string, unknown>;
}

export function TrackPageView({ event, params }: Props) {
  useEffect(() => {
    trackEvent(event, params);
  }, []);
  return null;
}
