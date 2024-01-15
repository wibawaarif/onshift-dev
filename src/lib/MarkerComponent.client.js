"use client";

import React, { useEffect } from "react";
import markerSDK from "@marker.io/browser";

export default function MarkerComponent() {
  useEffect(() => {
    markerSDK.loadWidget({
      project: "65a4a26ebe2260abce78cba6",
    });
  }, []);

  return null;
}
