import re

def main():
    with open("src/index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Text Highlighting
    head_end = content.find("</head>")
    if head_end != -1:
        style_inject = """  <style>
    ::selection {
      background-color: #ffffff;
      color: #000000;
    }
  </style>\n"""
        if "::selection {" not in content:
            content = content[:head_end] + style_inject + content[head_end:]

    # 2. Resume direct download replacement
    # For all a tags that have the drive link, replace with local pdf and download attribute
    old_resume_link = 'href="https://drive.google.com/file/d/1nxNsvq1KsCcRGUYCrk3SioMnG-0LDmMg/view?usp=sharing"'
    new_resume_link = 'href="resume.pdf" download="Praneeth_Kilaparthi_Resume.pdf"'
    content = content.replace(old_resume_link, new_resume_link)

    # 3. GitHub Activity Graph
    tech_stack_start = content.find('<div class="home__awards__stack" data-fade-in="">\n            <h2 class="home__content__title">Tech Stack</h2>')
    if tech_stack_start != -1:
        github_graph = """          <div class="home__awards__stack" data-fade-in="" style="margin-bottom: 40px;">
            <h2 class="home__content__title">GitHub Activity</h2>
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
              <img src="https://ghchart.rshah.org/FFFFFF/Praneeth1136" alt="Praneeth1136's Github chart" style="width: 100%; height: auto;" />
            </div>
          </div>\n\n"""
        # Inject right before tech stack if it hasn't been added yet
        if "GitHub Activity" not in content:
            content = content[:tech_stack_start] + github_graph + content[tech_stack_start:]

    # 4. Contact Form
    contact_section_end = content.find('</section>\n\n      <footer class="home__footer" id="js-footer">')
    if contact_section_end != -1:
        contact_form = """
        <div style="max-width: 600px; margin: 40px auto; display: flex; flex-direction: column; gap: 15px; padding: 0 20px;">
          <h3 style="text-align: center; font-size: 1.2rem; font-weight: normal; margin-bottom: 10px;">Or send a direct message</h3>
          <form action="https://formsubmit.co/praneethkilaparthi@gmail.com" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
            <input type="text" name="name" placeholder="Your Name" required style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; font-family: inherit; font-size: 1rem; outline: none;">
            <input type="email" name="email" placeholder="Your Email" required style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; font-family: inherit; font-size: 1rem; outline: none;">
            <textarea name="message" placeholder="Your Message" required rows="4" style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; font-family: inherit; font-size: 1rem; resize: vertical; outline: none;"></textarea>
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_template" value="table">
            <button type="submit" style="padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.4); background: white; color: black; font-weight: bold; font-family: inherit; cursor: pointer; text-transform: uppercase; font-size: 1rem; transition: background 0.3s;" onmouseover="this.style.background='#eee'" onmouseout="this.style.background='white'">Send Message</button>
          </form>
        </div>"""
        
        if "https://formsubmit.co/" not in content:
            content = content[:contact_section_end] + contact_form + "\n      " + content[contact_section_end:]

    with open("src/index.html", "w", encoding="utf-8") as f:
        f.write(content)

    print("Final addons applied successfully.")

if __name__ == "__main__":
    main()
