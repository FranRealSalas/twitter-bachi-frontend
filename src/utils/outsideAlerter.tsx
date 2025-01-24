import { useEffect } from "react";

export function useOutsideAlerter(ref: any, callback: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (ref.current && !ref.current.contains(event.target)) {
        setTimeout(() => callback(false), 100);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
