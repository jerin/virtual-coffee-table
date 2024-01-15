import { useState, useRef } from "react";
export function Copy() {
  const [copySuccess, setCopySuccess] = useState("")
  const textAreaRef = useRef(null)

  async function copyToClip() {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess("Copied");
  }

  return (
      <>
          <input onClick={copyToClip}>
              Copy
          </input>
      </>
  )
}