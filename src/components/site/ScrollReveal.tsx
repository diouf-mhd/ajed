"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const main = document.querySelector("#contenu");
    if (!main) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0 },
    );

    const registerSections = (root: ParentNode) => {
      root.querySelectorAll("section:not(.scroll-reveal)").forEach((section) => {
        section.classList.add("scroll-reveal");
        observer.observe(section);
      });
    };

    registerSections(main);
    document.body.classList.add("scroll-reveal-enabled");

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("section")) registerSections(node.parentNode ?? main);
            else registerSections(node);
          }
        });
      });
    });
    mutations.observe(main, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      document.body.classList.remove("scroll-reveal-enabled");
      main.querySelectorAll(".scroll-reveal").forEach((section) => {
        section.classList.remove("scroll-reveal", "is-visible");
      });
    };
  }, []);

  return null;
}
