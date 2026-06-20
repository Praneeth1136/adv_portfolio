import re

def main():
    with open("src/index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Visitor Counter
    # Find footer__links and append the badge after the link__flex div
    link_flex_end = content.find("</div>\n          </div>\n        </div>\n      </footer>")
    if link_flex_end != -1:
        visitor_badge = """\n            <div style="margin-top: 30px; text-align: center; opacity: 0.8;">
              <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fpraneethkilaparthi.dev&count_bg=%23111111&title_bg=%23111111&icon=&icon_color=%23E7E7E7&title=Profile+Views&edge_flat=false" alt="Profile Views"/>
            </div>"""
        if "hits.seeyoufarm.com" not in content:
            # We must be careful to insert it exactly at link_flex_end
            idx = content.find("</div>\n          </div>", link_flex_end - 50)
            if idx != -1:
                content = content[:idx+6] + visitor_badge + content[idx+6:]

    # 2. Welcome Toast Notification
    body_end = content.find("</body>")
    if body_end != -1:
        toast_html = """
    <div id="toast-notification" style="position: fixed; bottom: -100px; right: 20px; background: #ffffff; color: #000; padding: 15px 25px; border-radius: 8px; font-weight: bold; font-family: sans-serif; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: bottom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); display: flex; align-items: center; gap: 10px; pointer-events: none;">
      <span style="font-size: 1.5rem;">👋</span>
      <span>Welcome! I'm open for SWE roles.</span>
    </div>\n"""
        if "toast-notification" not in content:
            content = content[:body_end] + toast_html + content[body_end:]

    # 3. Interactive Terminal
    expertise_text = """<a href="#" target="_blank" rel="noopener noreferrer">KUBERNETES</a>.
        </p>"""
    exp_end = content.find(expertise_text)
    if exp_end != -1:
        exp_end += len(expertise_text)
        terminal_html = """
        <div data-fade-in="" style="margin-top: 40px; background: #1a1a1a; border-radius: 8px; border: 1px solid #333; overflow: hidden; font-family: 'Courier New', Courier, monospace; font-size: 0.95rem; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <div style="background: #2d2d2d; padding: 10px 15px; display: flex; gap: 8px; align-items: center;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
            <span style="margin-left: 10px; color: #888; font-size: 0.8rem;">guest@praneeth-portfolio: ~</span>
          </div>
          <div id="terminal-body" style="padding: 20px; height: 250px; overflow-y: auto; color: #ddd; display: flex; flex-direction: column;">
            <div style="margin-bottom: 10px;">Type <span style="color: #27c93f;">'help'</span> to see available commands.</div>
            <div id="terminal-output" style="flex-grow: 1;"></div>
            <div style="display: flex; gap: 10px; margin-top: 10px; align-items: center;">
              <span style="color: #27c93f;">➜</span>
              <span style="color: #58a6ff;">~</span>
              <input type="text" id="terminal-input" autocomplete="off" spellcheck="false" style="background: transparent; border: none; color: white; outline: none; flex-grow: 1; font-family: inherit; font-size: inherit; width: 100%;">
            </div>
          </div>
        </div>"""
        if "guest@praneeth-portfolio" not in content:
            content = content[:exp_end] + terminal_html + content[exp_end:]

    with open("src/index.html", "w", encoding="utf-8") as f:
        f.write(content)

    # Now JS injection
    with open("src/js/index.js", "r", encoding="utf-8") as f:
        js_content = f.read()

    extra_js = """
// --- EXTRA ADDONS ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Toast Notification
  setTimeout(() => {
    const toast = document.getElementById("toast-notification");
    if (toast) {
      toast.style.bottom = "30px";
      setTimeout(() => {
        toast.style.bottom = "-100px";
      }, 5000);
    }
  }, 2500);

  // 2. Interactive Terminal
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  const termBody = document.getElementById("terminal-body");

  if (termInput && termOutput) {
    termBody.addEventListener("click", () => termInput.focus());

    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        let response = "";
        
        termOutput.innerHTML += `<div style="display: flex; gap: 10px; margin-top: 10px;">
          <span style="color: #27c93f;">➜</span>
          <span style="color: #58a6ff;">~</span>
          <span>${termInput.value}</span>
        </div>`;

        switch(cmd) {
          case "help":
            response = "Available commands: <br> - <span style='color: #ffbd2e;'>whoami</span>: Learn about me <br> - <span style='color: #ffbd2e;'>skills</span>: View my tech stack <br> - <span style='color: #ffbd2e;'>clear</span>: Clear terminal";
            break;
          case "whoami":
            response = "Praneeth Kilaparthi. Full-Stack Engineer specializing in React, Node.js, and Agentic AI. Currently seeking SWE roles.";
            break;
          case "skills":
            response = "Python, Java, React, Node.js, Kubernetes, Docker, AWS, LangChain.";
            break;
          case "clear":
            termOutput.innerHTML = "";
            break;
          case "":
            break;
          default:
            response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (response) {
          termOutput.innerHTML += `<div style="margin-top: 5px; color: #ddd; line-height: 1.5;">${response}</div>`;
        }

        termInput.value = "";
        setTimeout(() => {
          termBody.scrollTop = termBody.scrollHeight;
        }, 10);
      }
    });
  }
});
"""
    if "EXTRA ADDONS" not in js_content:
        js_content += extra_js
        with open("src/js/index.js", "w", encoding="utf-8") as f:
            f.write(js_content)

    print("Crazy addons applied.")

if __name__ == "__main__":
    main()
