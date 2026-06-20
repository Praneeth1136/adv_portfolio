import re

def main():
    with open("src/index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # Back to Top Button HTML
    btn_html = """
    <!-- BACK TO TOP BUTTON -->
    <div id="back-to-top" style="position: fixed; bottom: -60px; right: 20px; width: 45px; height: 45px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9999; backdrop-filter: blur(5px); transition: bottom 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), background 0.3s; color: white;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </div>
"""
    
    if "BACK TO TOP BUTTON" not in content:
        body_end = content.find("</body>")
        if body_end != -1:
            content = content[:body_end] + btn_html + content[body_end:]

    with open("src/index.html", "w", encoding="utf-8") as f:
        f.write(content)

    # JS logic
    with open("src/js/index.js", "r", encoding="utf-8") as f:
        js_content = f.read()

    js_logic = """
  // 4. Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    // Show/hide based on scroll
    scroll.on("scroll", (args) => {
      if (args.scroll.y > 500) {
        backToTop.style.bottom = "20px";
      } else {
        backToTop.style.bottom = "-60px";
      }
    });

    // Click to scroll to top
    backToTop.addEventListener("click", () => {
      scroll.scrollTo(0, { duration: 1000, easing: [0.25, 0.0, 0.35, 1.0] });
    });
  }
"""
    if "Back to Top Button" not in js_content:
        # Insert before the last closing bracket of DOMContentLoaded
        idx = js_content.rfind("});\n")
        if idx != -1:
            js_content = js_content[:idx] + js_logic + js_content[idx:]
            with open("src/js/index.js", "w", encoding="utf-8") as f:
                f.write(js_content)

    print("Back to Top added.")

if __name__ == "__main__":
    main()
