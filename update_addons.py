import re

def main():
    with open("src/index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Nav Links
    nav_old = """          <button class="nav__button c-button contact-scroll" nav-anim="">
            <span class="c-link">
              <span class="c-link__inner">
                <span> contact </span>
                <span class="c-link__animated"> contact </span>
              </span>
            </span>
          </button>"""
    
    nav_new = """          <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" class="nav__button c-button" nav-anim="" style="margin-right: 15px;">
            <span class="c-link">
              <span class="c-link__inner">
                <span> github </span>
                <span class="c-link__animated"> github </span>
              </span>
            </span>
          </a>
          <a href="https://linkedin.com/in/praneeth-986bab325/" target="_blank" rel="noopener noreferrer" class="nav__button c-button" nav-anim="" style="margin-right: 15px;">
            <span class="c-link">
              <span class="c-link__inner">
                <span> linkedin </span>
                <span class="c-link__animated"> linkedin </span>
              </span>
            </span>
          </a>
          <button class="nav__button c-button contact-scroll" nav-anim="">
            <span class="c-link">
              <span class="c-link__inner">
                <span> contact </span>
                <span class="c-link__animated"> contact </span>
              </span>
            </span>
          </button>"""

    content = content.replace(nav_old, nav_new)

    # 2. Tech Stack
    tech_stack_old = """          <div class="home__awards__stack" data-fade-in="">
            <h2 class="home__content__title">Tech Stack</h2>
            <p class="home__content__desc">
              Python, Java, JavaScript, React, Redux Toolkit, Node.js, Express,
              LangChain, Docker, Kubernetes, AWS (EC2, S3), MongoDB, Git, Linux <br>
              <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer">See my Github</a>
            </p>
          </div>"""
    
    tech_stack_new = """          <div class="home__awards__stack" data-fade-in="">
            <h2 class="home__content__title">Tech Stack</h2>
            <div style="margin-bottom: 20px; font-size: 0.95rem; line-height: 1.8; opacity: 0.8;">
              <strong>Languages:</strong> Python, Java, JavaScript, SQL, Bash<br>
              <strong>Core CS:</strong> DSA, DBMS, OS, OOP, Agile/Scrum<br>
              <strong>AI / ML:</strong> LangChain, LLM APIs, AI Agents, RAG<br>
              <strong>Web &amp; Backend:</strong> React, Node.js, Express, REST APIs, MongoDB<br>
              <strong>DevOps &amp; Cloud:</strong> Docker, Kubernetes (K8s), AWS, Git, Linux
            </div>
            <p class="home__content__desc" style="margin-top: 10px;">
              <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">See my Github</a>
            </p>
          </div>"""

    content = content.replace(tech_stack_old, tech_stack_new)

    # 3. Capstone Visit Site -> Source Code
    capstone_btn_old = """    <div class="project__link">
      <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Visit Site"""
    
    capstone_btn_new = """    <div class="project__link">
      <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Source Code"""
    
    # We will just do a localized replacement near the Capstone project title.
    # The simplest is to find "CAPSTONE" then replace the NEXT occurrence of Visit Site.
    idx = content.find("CAPSTONE: MULTI-AGENT")
    if idx != -1:
        vidx = content.find("Visit Site", idx)
        if vidx != -1:
            content = content[:vidx] + "Source Code" + content[vidx+10:]

    # DevTinder Visit Site -> Source Code
    idx = content.find("DEVTINDER: DEVELOPER NETWORKING")
    if idx != -1:
        vidx = content.find("Visit Site", idx)
        if vidx != -1:
            content = content[:vidx] + "Source Code" + content[vidx+10:]
            
    # Inquiro: Dual Buttons
    idx = content.find("INQUIRO: REAL-TIME SEARCH AGENT")
    if idx != -1:
        link_start = content.find('<div class="project__link">', idx)
        link_end = content.find('</div>\n    </div>', link_start) + 6
        
        inquiro_links_new = """    <div class="project__link" style="display: flex; gap: 15px; margin-top: 20px;">
      <a href="https://github.com/Praneeth1136/inquiro" target="_blank" rel="noopener noreferrer" class="c-button" style="border: 1px solid rgba(255,255,255,0.3); padding: 10px 20px; border-radius: 30px;">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Source Code
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
      <a href="https://inquiro-ten-roan.vercel.app/" target="_blank" rel="noopener noreferrer" class="c-button" style="border: 1px solid rgba(255,255,255,0.3); padding: 10px 20px; border-radius: 30px; background: rgba(255,255,255,0.1);">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Live Demo
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
    </div>"""
        
        content = content[:link_start] + inquiro_links_new + content[link_end:]


    with open("src/index.html", "w", encoding="utf-8") as f:
        f.write(content)

    print("Addons updated successfully.")

if __name__ == "__main__":
    main()
