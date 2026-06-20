import re

def main():
    with open("src/index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # We will insert the skills marquee right before `<section class="home__projects" data-projects-section-1="">`
    # Let's find that section
    projects_start = content.find('<section class="home__projects" data-projects-section-1="">')
    
    if projects_start != -1 and "SKILLS__MARQUEE" not in content:
        marquee_html = """
      <!-- SKILLS MARQUEE ADDON -->
      <section class="home__contact" style="padding-top: 0; padding-bottom: 6rem; margin-top: -4rem;">
        <div class="line-wrapper">
          <span class="home__projects__line left" style="visibility: visible;">
            <span style="transform: scaleX(1);"></span>
          </span>
        </div>

        <div class="marquee" style="background: rgba(255,255,255,0.02);">
          <div class="marquee__wrap">
            <div class="marquee__inner" style="animation: marquee 35s linear infinite; padding-top: 1.5rem; padding-bottom: 1.5rem;">
              <span aria-hidden="true" class="inner-span" style="font-size: 3rem; color: rgba(255,255,255,0.7); font-weight: normal; font-family: sans-serif; text-transform: uppercase; letter-spacing: 2px;">
                REACT JS &nbsp; ✦ &nbsp; NODE.JS &nbsp; ✦ &nbsp; KUBERNETES &nbsp; ✦ &nbsp; DOCKER &nbsp; ✦ &nbsp; PYTHON &nbsp; ✦ &nbsp; AI AGENTS &nbsp; ✦ &nbsp; MONGODB &nbsp; ✦ &nbsp; AWS &nbsp; ✦ &nbsp; 
              </span>
              <span class="inner-span" style="font-size: 3rem; color: rgba(255,255,255,0.7); font-weight: normal; font-family: sans-serif; text-transform: uppercase; letter-spacing: 2px;">
                REACT JS &nbsp; ✦ &nbsp; NODE.JS &nbsp; ✦ &nbsp; KUBERNETES &nbsp; ✦ &nbsp; DOCKER &nbsp; ✦ &nbsp; PYTHON &nbsp; ✦ &nbsp; AI AGENTS &nbsp; ✦ &nbsp; MONGODB &nbsp; ✦ &nbsp; AWS &nbsp; ✦ &nbsp; 
              </span>
            </div>
          </div>
        </div>

        <div class="line-wrapper">
          <span class="home__projects__line right" style="visibility: visible;">
            <span style="transform: scaleX(1);"></span>
          </span>
        </div>
      </section>
"""
        content = content[:projects_start] + marquee_html + content[projects_start:]

    with open("src/index.html", "w", encoding="utf-8") as f:
        f.write(content)

    print("Skills marquee added.")

if __name__ == "__main__":
    main()
