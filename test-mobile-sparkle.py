"""Mobile view UI test: open work experience, click sparkle, check layout."""
import sys, os
from datetime import datetime
from playwright.sync_api import sync_playwright

URL = "http://localhost:3333/resume-builder"
SCREENSHOTS_DIR = "./QA screenshots"

def log(msg):
    print(f"[TEST] {msg}")

ts = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
folder = os.path.join(SCREENSHOTS_DIR, ts)
os.makedirs(folder, exist_ok=True)

def shot(page, name):
    path = os.path.join(folder, f"{name}.png")
    page.screenshot(path=path, full_page=True)
    log(f"  Screenshot: {name}.png")

passed = 0
failed = 0

def check(name, condition, detail=""):
    global passed, failed
    if condition:
        log(f"  PASS: {name}")
        passed += 1
    else:
        log(f"  FAIL: {name} {detail}")
        failed += 1

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    VW, VH = 375, 812
    context = browser.new_context(
        viewport={"width": VW, "height": VH},
        is_mobile=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
    )
    page = context.new_page()

    # Step 1: Load site
    log("--- Step 1: Load site ---")
    page.goto(URL, wait_until="networkidle", timeout=20000)
    shot(page, "01-site-loaded")
    check("Page loaded", "resume-builder" in page.url)

    # Step 2: Find and expand work experience section
    log("--- Step 2: Expand Work Experience ---")
    heading_inputs = page.locator('input[type="text"]')
    work_exp_header = None
    for i in range(heading_inputs.count()):
        val = heading_inputs.nth(i).input_value()
        log(f"  Heading #{i}: '{val}'")
        if "work" in val.lower() or "experience" in val.lower():
            work_exp_header = heading_inputs.nth(i)
            break

    check("Work Experience heading found", work_exp_header is not None)

    if work_exp_header:
        work_exp_header.click()
        page.wait_for_timeout(800)
        shot(page, "02-work-exp-expanded")

        add_job = page.locator('button:has-text("Add Job")')
        job_visible = add_job.is_visible(timeout=3000)
        check("Work Experience expanded (Add Job visible)", job_visible)

        # Step 3: Click sparkle button
        log("--- Step 3: Click sparkle button ---")
        sparkles = page.locator('button[aria-label="Enhance with AI"]')
        sc = sparkles.count()
        log(f"  Total sparkle buttons: {sc}")

        if sc > 0:
            sparkles.first.click()
            page.wait_for_timeout(1000)
            shot(page, "03-sparkle-clicked")

            # Step 4: Check AI panel & UI cleanliness
            log("--- Step 4: Check AI panel + UI cleanliness ---")
            ai_header = page.locator('span:has-text("AI Enhance")')
            panel_open = ai_header.is_visible(timeout=3000)
            check("AI panel opened", panel_open)

            if panel_open:
                panel = page.locator('.ai-panel')
                check("AI panel .ai-panel visible",
                      panel.is_visible(timeout=2000))

                # No horizontal scroll
                sw = page.evaluate("document.documentElement.scrollWidth")
                check("No horizontal scroll", sw <= VW + 5, f"scroll={sw} vp={VW}")

                # Form stays expanded
                check("Form stays expanded after sparkle",
                      page.locator('button:has-text("Add Job")').is_visible(timeout=2000))

                # Panel overlay - check position
                overlay = page.locator('.ai-panel-overlay')
                ob = overlay.bounding_box()
                pb = panel.bounding_box()
                if ob and pb:
                    log(f"  Overlay: x={ob['x']:.0f} y={ob['y']:.0f} w={ob['width']:.0f} h={ob['height']:.0f}")
                    log(f"  Panel:   x={pb['x']:.0f} y={pb['y']:.0f} w={pb['width']:.0f} h={pb['height']:.0f}")
                    check("Overlay covers full viewport",
                          ob['x'] <= 0 and ob['y'] <= 0 and ob['width'] >= VW and ob['height'] >= VH)
                    check("Panel fits in viewport width", pb['width'] <= VW)
                    check("Panel near top", pb['y'] < VH * 0.3)

                shot(page, "04-ai-panel-open")

                # Step 5: Close panel via Escape
                log("--- Step 5: Close panel ---")
                page.keyboard.press("Escape")
                page.wait_for_timeout(600)
                shot(page, "05-after-panel-close")

                overlay_gone = page.locator('.ai-panel-overlay').count() == 0
                check("AI panel overlay removed on Escape", overlay_gone)

                check("Form still expanded after panel close",
                      page.locator('button:has-text("Add Job")').is_visible(timeout=2000))

        # Step 6: Final cleanliness
        log("--- Step 6: Final UI cleanliness check ---")
        sw2 = page.evaluate("document.documentElement.scrollWidth")
        check("No horizontal scroll at end", sw2 <= VW + 5)

        btn_count = page.locator('section.relative button').count()
        log(f"  Total buttons in form sections: {btn_count}")

    log(f"\nResults: {passed} passed, {failed} failed")
    log(f"Screenshots: {folder}/")
    browser.close()
    sys.exit(0 if failed == 0 else 1)
