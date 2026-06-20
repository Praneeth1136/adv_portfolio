import re

def main():
    with open("src/index.html", "r", encoding="utf-8") as f:
        content = f.read()

    blur_html = """
    <!-- AMBIENT GRADIENT GLOW -->
    <div style="position: absolute; top: -20%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(120,0,255,0.15) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: -1; animation: pulseGlow 10s infinite alternate;"></div>
    <div style="position: absolute; top: 10%; right: -10%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(255,100,0,0.1) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: -1; animation: pulseGlow 8s infinite alternate-reverse;"></div>
    <style>
      @keyframes pulseGlow {
        0% { transform: scale(1) translate(0, 0); opacity: 0.8; }
        100% { transform: scale(1.2) translate(50px, 50px); opacity: 1; }
      }
    </style>
"""
    
    if "AMBIENT GRADIENT GLOW" not in content:
        main_start = content.find('<main class="home" data-scroll-container="">')
        if main_start != -1:
            main_start += len('<main class="home" data-scroll-container="">')
            content = content[:main_start] + blur_html + content[main_start:]

    with open("src/index.html", "w", encoding="utf-8") as f:
        f.write(content)

    print("Ambient glow added.")

if __name__ == "__main__":
    main()
