import re

with open("src/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Projects Order and Add View More
# I will replace the chunk from Project 2 (Inquiro) down to the end of Project Section 2
# We know where it starts roughly:
start_marker = '</div><span class="home__projects__line right"><span></span></span><div class="home__projects__project left">\n      \n    <div class="home__projects__project__label">\n      <div class="label__inner">\n         <p>LangChain / <br> Groq &amp; Socket.io</p>'

end_marker = 'SMART CODE BASE — AI SEARCH ENGINE\n          </div>\n        </span>\n      </h1>\n    </a>\n      \n    <div class="project__link">\n      <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" class="c-button">\n        <span class="c-link">\n          <span class="c-link__inner">\n            <span>\n              Visit Site\n              <span class="share-icon">\n                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">\n                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>\n                </svg>\n              </span>\n            </span>\n          </span>\n        </span>\n      </a>\n    </div>\n    </div><span class="home__projects__line left"><span></span></span></section>'

start_idx = content.find('    </div><span class="home__projects__line right"><span></span></span><div class="home__projects__project left">\n      \n    <div class="home__projects__project__label">\n      <div class="label__inner">\n         <p>LangChain')

end_idx = content.find(end_marker) + len(end_marker)

replacement_projects = """    </div><span class="home__projects__line right"><span></span></span><div class="home__projects__project left">
      
    <div class="home__projects__project__label">
      <div class="label__inner">
         <p>Node.js / <br> React &amp; Socket.io</p>
       </div>
    </div>
      
    <a href="https://github.com/Praneeth1136/DevTinder_Main" target="_blank" rel="noopener noreferrer" class="home__projects__project__link">
      <h1 class="home__projects__project__title" data-scroll="" data-scroll-direction="horizontal" data-scroll-speed="-8">
        <span class="inline-ovh">
          <div class="title__main left">
            <span class="slide-up" data-content="DEVTINDER: DEVELOPER NETWORKING" aria-hidden="true"></span>
            DEVTINDER: DEVELOPER NETWORKING
          </div>
        </span>
      </h1>
    </a>
      
    <div class="project__link">
      <a href="https://github.com/Praneeth1136/DevTinder_Main" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Visit Site
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
    </div>
    </div><span class="home__projects__line left"><span></span></span><div class="home__projects__project right">
      
    <div class="home__projects__project__label">
      <div class="label__inner">
         <p>LangChain / <br> Groq &amp; Socket.io</p>
       </div>
    </div>
      
    <a href="https://inquiro-ten-roan.vercel.app/" target="_blank" rel="noopener noreferrer" class="home__projects__project__link">
      <h1 class="home__projects__project__title" data-scroll="" data-scroll-direction="horizontal" data-scroll-speed="8">
        <span class="inline-ovh">
          <div class="title__main right">
            <span class="slide-up" data-content="INQUIRO: REAL-TIME SEARCH AGENT" aria-hidden="true"></span>
            INQUIRO: REAL-TIME SEARCH AGENT
          </div>
        </span>
      </h1>
    </a>
      
    <div class="project__link">
      <a href="https://inquiro-ten-roan.vercel.app/" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Visit Site
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
    </div>
    </div><span class="home__projects__line right"><span></span></span></section>

    <div class="home__projects__view-more" style="text-align: center; padding: 40px 0; padding-bottom: 60px;">
      <button id="view-more-btn" style="padding: 15px 30px; font-size: 1rem; cursor: pointer; background: transparent; color: white; border: 1px solid white; transition: all 0.3s;" onmouseover="this.style.background='white'; this.style.color='black';" onmouseout="this.style.background='transparent'; this.style.color='white';">
        VIEW MORE PROJECTS
      </button>
    </div>

    <div id="more-projects" style="display: none; width: 100%;">
      <section class="home__projects" data-projects-section-2="">
        <span class="home__projects__line left"><span></span></span><div class="home__projects__project right">
      
    <div class="home__projects__project__label">
      <div class="label__inner">
         <p>React / <br> OpenAI &amp; Firebase</p>
       </div>
    </div>
      
    <a href="https://netflix-gpt-xi-virid.vercel.app/" target="_blank" rel="noopener noreferrer" class="home__projects__project__link">
      <h1 class="home__projects__project__title" data-scroll="" data-scroll-direction="horizontal" data-scroll-speed="8">
        <span class="inline-ovh">
          <div class="title__main right">
            <span class="slide-up" data-content="NETFLIX GPT — AI STREAMING" aria-hidden="true"></span>
            NETFLIX GPT — AI STREAMING
          </div>
        </span>
      </h1>
    </a>
      
    <div class="project__link">
      <a href="https://netflix-gpt-xi-virid.vercel.app/" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Visit Site
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
    </div>
    </div><span class="home__projects__line right"><span></span></span><div class="home__projects__project left">
      
    <div class="home__projects__project__label">
      <div class="label__inner">
         <p>React / <br> Redux Toolkit</p>
       </div>
    </div>
      
    <a href="https://swigggy.vercel.app/" target="_blank" rel="noopener noreferrer" class="home__projects__project__link">
      <h1 class="home__projects__project__title" data-scroll="" data-scroll-direction="horizontal" data-scroll-speed="-8">
        <span class="inline-ovh">
          <div class="title__main left">
            <span class="slide-up" data-content="SWIGGY — FOOD DELIVERY APP" aria-hidden="true"></span>
            SWIGGY — FOOD DELIVERY APP
          </div>
        </span>
      </h1>
    </a>
      
    <div class="project__link">
      <a href="https://swigggy.vercel.app/" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Visit Site
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
    </div>
    </div><span class="home__projects__line left"><span></span></span><div class="home__projects__project right">
      
    <div class="home__projects__project__label">
      <div class="label__inner">
         <p>Node.js / <br> Gemini API</p>
       </div>
    </div>
      
    <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" class="home__projects__project__link">
      <h1 class="home__projects__project__title" data-scroll="" data-scroll-direction="horizontal" data-scroll-speed="8">
        <span class="inline-ovh">
          <div class="title__main right">
            <span class="slide-up" data-content="SMART CODE BASE — AI SEARCH ENGINE" aria-hidden="true"></span>
            SMART CODE BASE — AI SEARCH ENGINE
          </div>
        </span>
      </h1>
    </a>
      
    <div class="project__link">
      <a href="https://github.com/Praneeth1136" target="_blank" rel="noopener noreferrer" class="c-button">
        <span class="c-link">
          <span class="c-link__inner">
            <span>
              Visit Site
              <span class="share-icon">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.337 7.845l-7.173 7.173-1.178-1.179 7.172-7.172H5.837V5h9.166v9.167h-1.666V7.845z" fill="#777"></path>
                </svg>
              </span>
            </span>
          </span>
        </span>
      </a>
    </div>
    </div><span class="home__projects__line right"><span></span></span></section>
    </div>"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + replacement_projects + content[end_idx:]
else:
    print("Could not find start or end markers for projects replacement")
    print(f"start_idx={start_idx}, end_idx={end_idx}")

# 2. Add Experience Section before Expertise
experience_section = """      <section class="home__content" style="padding-bottom: 2rem;">
        <h2 class="home__content__title">EXPERIENCE</h2>
        <div class="home__content__desc">
          <h3 style="margin-bottom: 10px; font-weight: normal; color: #fff; font-size: 1.2rem;">Full-Stack Developer Intern — Technical Hub</h3>
          <p style="margin-bottom: 15px; opacity: 0.8; font-size: 0.9em; font-family: sans-serif;">May 2025 — Jul 2025 &nbsp;|&nbsp; <a href="https://drive.google.com/file/d/12cw34AdhQ156j6PfYu14WPT_59vzDnhp/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Internship Letter</a></p>
          <ul style="list-style-type: disc; margin-left: 20px; opacity: 0.8; font-size: 0.9em; line-height: 1.6; font-family: sans-serif;">
            <li style="margin-bottom: 8px;">Engineered 5+ production pages and 12+ reusable components in React and Redux for a live client product serving 500+ daily users, cutting duplicate front-end code by 30%.</li>
            <li style="margin-bottom: 8px;">Delivered 8+ features across 3 sprints in a 5-member Agile/Scrum team, diagnosing and debugging 20+ high-priority issues in a production environment via Git-based code review.</li>
            <li>Implemented responsive, cross-platform interfaces validated across 5+ screen sizes.</li>
          </ul>
        </div>
      </section>

      <section class="home__content">
        <h2 class="home__content__title">EXPERTISE</h2>"""

content = content.replace('      <section class="home__content">\n        <h2 class="home__content__title">EXPERTISE</h2>', experience_section)

# 3. Update Certifications Links & Remove Internship from it
certs_old = """          <div class="home__awards__table">
            <div class="awards__item" data-fade-in="">
              Oracle Academy ⏤ Java Certification (2025)
            </div>
            <div class="awards__item" data-fade-in="">
              MongoDB ⏤ Associate Developer (2026)
            </div>
            <div class="awards__item" data-fade-in="">
              GitHub ⏤ GitHub Foundations (2026)
            </div>
            <div class="awards__item" data-fade-in="">
              Cisco Academy ⏤ Python, C, OS, HTML, CSS (2024)
            </div>
            <div class="awards__item" data-fade-in="">
              Technical Hub ⏤ Full-Stack Developer Intern (2025)
            </div>
            <div class="awards__item" data-fade-in="">
              CGPA ⏤ 8.63/10 · Computer Science
            </div>
          </div>"""

certs_new = """          <div class="home__awards__table">
            <div class="awards__item" data-fade-in="">
              <a href="https://drive.google.com/file/d/1Zr5Y-F863Gyh6YzbjOOAPNvpOKSiYO-2/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">Oracle Academy ⏤ Java Certification (2025)</a>
            </div>
            <div class="awards__item" data-fade-in="">
              <a href="https://www.credly.com/badges/44e50417-399a-437b-9c62-8b7f6a66ad76" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">MongoDB ⏤ Associate Developer (2026)</a>
            </div>
            <div class="awards__item" data-fade-in="">
              <a href="https://drive.google.com/file/d/1f3MsnvExmO4zFW8SErgJqL1ez2bjq0KH/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">GitHub ⏤ GitHub Foundations (2026)</a>
            </div>
            <div class="awards__item" data-fade-in="">
              Cisco Academy ⏤ Python, C, OS, HTML, CSS (2024)
            </div>
            <div class="awards__item" data-fade-in="">
              CGPA ⏤ 8.63/10 · Computer Science
            </div>
          </div>"""

if certs_old in content:
    content = content.replace(certs_old, certs_new)
else:
    print("Could not find certs block to replace")

with open("src/index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Update completed successfully.")
