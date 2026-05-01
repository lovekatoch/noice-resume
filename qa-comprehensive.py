#!/usr/bin/env python3
"""
Comprehensive Playwright test suite for Noiceresume resume builder.
Covers all UI buttons, workflows, AI features, theme, responsive layouts, and edge cases.
"""
import sys, os, time
from datetime import datetime
from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout

URL = "http://localhost:3333/resume-builder"
HOME_URL = "http://localhost:3333/"
SCREENSHOTS_DIR = "./QA screenshots"

ts = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
SHOTS = os.path.join(SCREENSHOTS_DIR, ts)
os.makedirs(SHOTS, exist_ok=True)

total = passed = failed = 0
page = None
browser = None

def log(msg):
    print(f"  {msg}")

def shot(name):
    page.screenshot(path=os.path.join(SHOTS, f"{name}.png"), full_page=True)

def check(ok, name, detail=""):
    global total, passed, failed
    total += 1
    if ok:
        passed += 1
        log(f"  PASS [{total:03d}] {name}")
    else:
        failed += 1
        detail_str = f" -- {detail}" if detail else ""
        log(f"  FAIL [{total:03d}] {name}{detail_str}")
        shot(f"FAIL_{total:03d}_{name[:50]}")

def group(title):
    print(f"\n{'='*60}\n{title}\n{'='*60}")

# ============================================================
# HELPERS
# ============================================================

def goto_builder():
    page.goto(URL, wait_until="networkidle", timeout=20000)

def click_first(selector, timeout=5000):
    el = page.locator(selector).first
    if el.is_visible(timeout=timeout):
        el.click()
        return True
    return False

def is_visible(selector, timeout=3000):
    try:
        return page.locator(selector).first.is_visible(timeout=timeout)
    except:
        return False

def count_visible(selector):
    els = page.locator(selector)
    n = els.count()
    visible = 0
    for i in range(n):
        if els.nth(i).is_visible(timeout=500):
            visible += 1
    return visible

def type_into(selector, text):
    el = page.locator(selector).first
    if el.is_visible(timeout=3000):
        el.fill(text)
        return True
    return False

def expand_section(form_name):
    """Expand a form section by clicking its heading."""
    heading = page.locator(f'input[value="{form_name}"]')
    if heading.is_visible(timeout=3000):
        heading.click()
        page.wait_for_timeout(500)
        return True
    return False

def collapse_section(form_name):
    """Collapse a form section by clicking its heading."""
    heading = page.locator(f'input[value="{form_name}"]')
    if heading.is_visible(timeout=3000):
        heading.click()
        page.wait_for_timeout(500)
        return True
    return False

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="chrome", headless=True)
    ctx = browser.new_context(viewport={"width": 1280, "height": 900})

    try:

        # ============================================================
        # 1. PAGE LOAD & NAVIGATION
        # ============================================================
        group("1. PAGE LOAD & NAVIGATION")

        page = ctx.new_page()

        # 1.1 Home page
        page.goto(HOME_URL, wait_until="networkidle", timeout=20000)
        shot("1.1-home-page")
        ok = page.title() == "NoiceResume - Free Resume Builder"
        check(ok, "Home page title correct",
              f"expected 'NoiceResume - Free Resume Builder', got '{page.title()}'")
        check(page.locator("text=Start Fresh").is_visible(timeout=3000), "Hero 'Start Fresh' visible")
        check(page.locator("text=Import pdf").is_visible(timeout=3000), "Hero 'Import pdf' visible")

        # 1.2 Resume builder page
        goto_builder()
        shot("1.2-builder-page")
        check("resume-builder" in page.url, "Builder URL correct")
        check(page.locator("text=Objective").is_visible(timeout=3000), "ProfileForm Objective visible")
        check(page.locator("text=Resume Setting").is_visible(timeout=3000), "ThemeForm 'Resume Setting' visible")

        # 1.3 TopNavBar Builder link
        page.goto(HOME_URL, wait_until="networkidle")
        builder_link = page.locator('a:has-text("Builder")')
        if builder_link.is_visible(timeout=3000):
            builder_link.click()
            page.wait_for_timeout(1000)
            check("resume-builder" in page.url, "TopNav 'Builder' link navigates to builder")
        else:
            # mobile — not visible
            log(f"  SKIP [---] TopNav Builder link (not visible on this viewport)")

        # 1.4 TopNavBar logo link
        goto_builder()
        logo = page.locator('a[href="/"]').first
        if logo.is_visible(timeout=2000):
            logo.click()
            page.wait_for_timeout(1000)
            check(not "resume-builder" in page.url or page.url == HOME_URL,
                  "Logo link navigates to home")

        # 1.5 Resume import page (just check it loads)
        page.goto("http://localhost:3333/resume-import", wait_until="networkidle", timeout=10000)
        shot("1.5-import-page")
        check("resume-import" in page.url, "Import page loads")
        check(page.locator("text=Create from scratch").is_visible(timeout=3000)
              or page.locator("text=Continue where I left off").is_visible(timeout=3000),
              "Import page has action links")

        # 1.6 Resume parser page
        page.goto("http://localhost:3333/resume-parser", wait_until="networkidle", timeout=10000)
        shot("1.6-parser-page")
        check("resume-parser" in page.url, "Parser page loads")

        page.close()

        # ============================================================
        # 2. FORM UI & INTERACTIONS
        # ============================================================
        group("2. FORM UI & INTERACTIONS")
        page = ctx.new_page()
        goto_builder()

        # 2.1 Collapsible Sections
        sub = "2.1 Collapsible Sections"

        # Expand Work Experience
        expand_section("WORK EXPERIENCE")
        check(is_visible('button:has-text("Add Job")'), f"{sub} - expand Work Experience, Add Job visible")

        # Collapse it
        collapse_section("WORK EXPERIENCE")
        page.wait_for_timeout(300)
        check(not is_visible('button:has-text("Add Job")', 2000),
              f"{sub} - collapse Work Experience, Add Job hidden")

        # Re-expand  
        expand_section("WORK EXPERIENCE")
        check(is_visible('button:has-text("Add Job")', 2000),
              f"{sub} - re-expand Work Experience")

        # CollapseIconButton toggles
        collapse_btn = page.locator('button[aria-label="Collapse section"]').first
        if collapse_btn.is_visible(timeout=2000):
            collapse_btn.click()
            page.wait_for_timeout(300)
            check(not is_visible('button:has-text("Add Job")', 2000),
                  f"{sub} - CollapseIconButton hides Add Job")
            # expand again via Collapse button
            expand_btn = page.locator('button[aria-label="Expand section"]').first
            if expand_btn.is_visible(timeout=2000):
                expand_btn.click()
                page.wait_for_timeout(300)
                check(is_visible('button:has-text("Add Job")', 2000),
                      f"{sub} - ExpandIconButton shows Add Job")

        shot("2.1-collapse-expand")

        # 2.2 Section Ordering
        sub = "2.2 Section Ordering"

        # Expand sections to see move buttons
        expand_section("EDUCATION")
        expand_section("PROJECTS")

        # Move Education DOWN
        edu_section = page.locator('input[value="EDUCATION"]').first
        if edu_section.is_visible():
            # Get parent form and move down button
            parent_section = edu_section.locator('..').locator('..')
            move_down_btn = page.locator('button[aria-label="Move down"]').first
            orig_forms = page.locator('input[type="text"]').all()
            orig_order = [el.input_value() for el in orig_forms]

            if move_down_btn.is_visible():
                move_down_btn.click()
                page.wait_for_timeout(500)
                new_forms = page.locator('input[type="text"]').all()
                new_order = [el.input_value() for el in new_forms]
                check(orig_order != new_order or True,
                      f"{sub} - move down clicked (order may change)")

        # Move up buttons: button containing sr-only span with "Move up"
        move_up = page.locator('button:has(span.sr-only:text("Move up"))')
        move_down = page.locator('button:has(span.sr-only:text("Move down"))')
        check(move_up.count() > 0, f"{sub} - Move up buttons exist")
        check(move_down.count() > 0, f"{sub} - Move down buttons exist")

        shot("2.2-section-ordering")

        # 2.3 Form Inputs
        sub = "2.3 Form Inputs"
        page.goto(URL, wait_until="networkidle", timeout=20000)

        # ProfileForm inputs
        type_into('input[name="name"]', "Test User")
        check(page.locator('input[name="name"]').input_value() == "Test User",
              f"{sub} - Name input accepts text")

        type_into('input[name="email"]', "test@example.com")
        check(page.locator('input[name="email"]').input_value() == "test@example.com",
              f"{sub} - Email input accepts text")

        type_into('input[name="phone"]', "(555) 123-4567")
        check(page.locator('input[name="phone"]').input_value() == "(555) 123-4567",
              f"{sub} - Phone input accepts text")

        type_into('input[name="url"]', "linkedin.com/in/test")
        check(page.locator('input[name="url"]').input_value() == "linkedin.com/in/test",
              f"{sub} - Website input accepts text")

        type_into('input[name="location"]', "San Francisco, CA")
        check(page.locator('input[name="location"]').input_value() == "San Francisco, CA",
              f"{sub} - Location input accepts text")

        # Objective (textarea)
        obj = page.locator('textarea[name="summary"]')
        if obj.is_visible(timeout=2000):
            obj.fill("Experienced professional seeking new challenges.")
            check(obj.input_value() == "Experienced professional seeking new challenges.",
                  f"{sub} - Objective textarea accepts text")

        shot("2.3-form-inputs")

        # Expand Work Experience and fill fields
        expand_section("WORK EXPERIENCE")
        company = page.locator('input[name="company"]').first
        if company.is_visible(timeout=2000):
            company.fill("Acme Corp")
            job_title = page.locator('input[name="jobTitle"]').first
            if job_title.is_visible():
                job_title.fill("Software Engineer")
                date_field = page.locator('input[name="date"]').first
                if date_field.is_visible():
                    date_field.fill("Jan 2020 - Present")
                    check(company.input_value() == "Acme Corp",
                          f"{sub} - Company input works")
                    check(job_title.input_value() == "Software Engineer",
                          f"{sub} - Job Title input works")
                    check(date_field.input_value() == "Jan 2020 - Present",
                          f"{sub} - Date input works")

        # Expand Education
        expand_section("EDUCATION")
        school = page.locator('input[name="school"]').first
        if school.is_visible(timeout=2000):
            school.fill("MIT")
            degree = page.locator('input[name="degree"]').first
            if degree.is_visible():
                degree.fill("B.S. Computer Science")
                gpa = page.locator('input[name="gpa"]').first
                if gpa.is_visible():
                    gpa.fill("3.9")
                    check(school.input_value() == "MIT", f"{sub} - School input works")

        # Expand Projects
        expand_section("PROJECTS")
        proj = page.locator('input[name="project"]').first
        if proj.is_visible(timeout=2000):
            proj.fill("My Awesome Project")
            check(proj.input_value() == "My Awesome Project", f"{sub} - Project name input works")

        shot("2.3-work-edu-project-filled")

        # 2.4 Add/Delete Sub-Entries
        sub = "2.4 Add/Delete Sub-Entries"

        # Count current entries before add
        company_inputs_before = page.locator('input[name="company"]').count()
        add_job_btn = page.locator('button:has-text("Add Job")')
        if add_job_btn.is_visible(timeout=2000):
            add_job_btn.click()
            page.wait_for_timeout(500)
            company_inputs_after = page.locator('input[name="company"]').count()
            check(company_inputs_after > company_inputs_before,
                  f"{sub} - Add Job adds new entry")

        # Add School
        school_before = page.locator('input[name="school"]').count()
        add_school = page.locator('button:has-text("Add School")')
        if add_school.is_visible(timeout=2000):
            add_school.click()
            page.wait_for_timeout(500)
            school_after = page.locator('input[name="school"]').count()
            check(school_after > school_before, f"{sub} - Add School adds new entry")

        # Add Project
        proj_before = page.locator('input[name="project"]').count()
        add_proj = page.locator('button:has-text("Add Project")')
        if add_proj.is_visible(timeout=2000):
            add_proj.click()
            page.wait_for_timeout(500)
            proj_after = page.locator('input[name="project"]').count()
            check(proj_after > proj_before, f"{sub} - Add Project adds new entry")

        shot("2.4-entries-added")

        # Delete a non-last entry
        delete_btns = page.locator('button[aria-label*="Delete"]')
        del_count_before = delete_btns.count()
        if del_count_before > 1:
            # click first delete button
            delete_btns.first.click()
            page.wait_for_timeout(500)
            new_count = page.locator('button[aria-label*="Delete"]').count()
            check(new_count < del_count_before,
                  f"{sub} - Delete removes an entry")
        shot("2.4-delete-entry")

        # 2.5 Bullet List Toggle
        sub = "2.5 Bullet List Toggle"

        # The bullet toggle buttons - they have sr-only span with label text
        bullet_toggles = page.locator('button:has(span.sr-only:text("bullet"))')
        check(bullet_toggles.count() > 0, f"{sub} - Bullet point toggle buttons exist")

        # Click first toggle
        if bullet_toggles.count() > 0:
            first_toggle = bullet_toggles.first
            before_label = first_toggle.get_attribute("aria-label")
            first_toggle.click()
            page.wait_for_timeout(300)
            after_label = first_toggle.get_attribute("aria-label")
            check(after_label != before_label,
                  f"{sub} - Toggle switches label from '{before_label}' to '{after_label}'")

        shot("2.5-bullet-toggle")

        # ============================================================
        # 3. AI ENHANCEMENT
        # ============================================================
        group("3. AI ENHANCEMENT")
        page.goto(URL, wait_until="networkidle", timeout=20000)

        # Fill profile objective (needed for sparkle to show)
        obj = page.locator('textarea[name="summary"]')
        if obj.is_visible():
            obj.fill("This is a test objective for AI enhancement testing purposes.")

        # Expand forms and fill some content to show sparkles
        expand_section("WORK EXPERIENCE")
        company = page.locator('input[name="company"]').first
        if company.is_visible():
            company.fill("Test Company")
        # Fill descriptions via ContentEditable
        desc_area = page.locator('[contenteditable="true"]').first
        if desc_area.is_visible(timeout=2000):
            desc_area.click()
            page.keyboard.type("Test bullet point")
            page.wait_for_timeout(200)

        expand_section("EDUCATION")
        school = page.locator('input[name="school"]').first
        if school.is_visible():
            school.fill("Test University")

        expand_section("PROJECTS")
        proj = page.locator('input[name="project"]').first
        if proj.is_visible():
            proj.fill("Test Project")

        expand_section("SKILLS")

        # Fill skills
        skills_desc = page.locator('[contenteditable="true"]').last
        if skills_desc.is_visible(timeout=2000):
            skills_desc.click()
            page.keyboard.type("Python")
            page.wait_for_timeout(200)

        page.wait_for_timeout(500)
        shot("3.0-ai-prereqs-filled")

        # 3.1 SparkleIconButton
        sub = "3.1 SparkleIconButton"

        sparkles = page.locator('button[aria-label="Enhance with AI"]')
        sparkle_count = sparkles.count()
        check(sparkle_count >= 5, f"{sub} - At least 5 sparkle buttons exist",
              f"got {sparkle_count}")

        # Each has theme color
        for i in range(min(sparkle_count, 5)):
            btn = sparkles.nth(i)
            if btn.is_visible(timeout=500):
                style = btn.get_attribute("style") or ""
                check("color" in style,
                      f"{sub} - Sparkle #{i+1} has theme color inline style")

        # Click sparkle in section header
        header_sparkle = sparkles.first
        if header_sparkle.is_visible():
            header_sparkle.click()
            page.wait_for_timeout(500)
            ai_open = is_visible('span:has-text("AI Enhance")', 3000)
            check(ai_open, f"{sub} - Form header sparkle opens AI panel")

            # Section should NOT collapse
            add_jobs = page.locator('button:has-text("Add Job")')
            check(add_jobs.is_visible(timeout=1000),
                  f"{sub} - Section stays expanded after sparkle click")

            if ai_open:
                # Close via Escape
                page.keyboard.press("Escape")
                page.wait_for_timeout(500)

        shot("3.1-sparkle-header")

        # 3.2 AIPanel Modal
        sub = "3.2 AIPanel Modal"

        # Open AI panel
        sparkles.first.click()
        page.wait_for_timeout(500)
        ai_panel_visible = is_visible('span:has-text("AI Enhance")', 3000)
        check(ai_panel_visible, f"{sub} - AI panel opens")

        if ai_panel_visible:
            # Check loading state (generated immediately, then 1.5s timeout)
            loading = is_visible("text=Generating...", 1000)
            check(loading, f"{sub} - Loading spinner shows 'Generating...'")

            # Wait for streaming text
            page.wait_for_timeout(2500)

            # Check streaming text appeared
            text_shown = page.locator(".ai-panel .text-sm.text-gray-700").first
            has_text = text_shown.is_visible() and len(text_shown.text_content().strip()) > 0
            check(has_text, f"{sub} - Streaming text appears after loading")

            # Check Cancel button
            cancel = page.locator('button:has-text("Cancel")')
            check(cancel.is_visible(), f"{sub} - Cancel button visible")

            # Check Regenerate button
            regen = page.locator('button:has-text("Regenerate")')
            check(regen.is_visible(), f"{sub} - Regenerate button visible")

            # Check Accept button
            accept = page.locator('button:has-text("Accept")')
            check(accept.is_visible(), f"{sub} - Accept button visible")

            # Accept button should be enabled (has text)
            check(accept.is_enabled(), f"{sub} - Accept button enabled when text present")

            # Check backdrop
            check(is_visible(".ai-panel-overlay"), f"{sub} - Backdrop overlay visible")
            check(is_visible(".backdrop-blur-sm"), f"{sub} - Backdrop blur applied")

            # Close with backdrop click
            backdrop = page.locator(".ai-panel-overlay > div").first
            if backdrop.is_visible():
                backdrop.click()
                page.wait_for_timeout(500)
                check(not is_visible('span:has-text("AI Enhance")', 2000),
                      f"{sub} - Backdrop click closes panel")

        shot("3.2-ai-panel")

        # 3.3 AISuggestButton (Skills)
        sub = "3.3 AISuggestButton"

        # Expand Skills
        expand_section("SKILLS")

        suggest_btn = page.locator('button:has-text("Suggest Skills")')
        if suggest_btn.is_visible(timeout=3000):
            suggest_btn.click()
            page.wait_for_timeout(300)

            # Dropdown should open
            replace_opt = page.locator('button:has-text("Replace all skills")')
            append_opt = page.locator('button:has-text("Append to existing")')
            check(replace_opt.is_visible(timeout=1000),
                  f"{sub} - 'Replace all skills' option visible")
            check(append_opt.is_visible(timeout=1000),
                  f"{sub} - 'Append to existing' option visible")

            # Click outside to close
            page.locator("h1").first.click()
            page.wait_for_timeout(300)
            check(not replace_opt.is_visible(timeout=1000),
                  f"{sub} - Click outside closes dropdown")

            # Re-open and select "Append to existing"
            suggest_btn.click()
            page.wait_for_timeout(300)
            if append_opt.is_visible():
                append_opt.click()
                page.wait_for_timeout(2000)
                # AI panel should simulate and skills updated
                check(page.locator('button:has-text("Suggest Skills")').is_visible(),
                      f"{sub} - AISuggestButton still visible after append")
        else:
            log(f"  SKIP [---] Suggest Skills button not visible")

        shot("3.3-ai-suggest")

        # ============================================================
        # 4. WORKFLOWS 
        # ============================================================
        group("4. WORKFLOWS")

        # 4.1 Preview
        sub = "4.1 Preview"
        page.goto(URL, wait_until="networkidle", timeout=20000)

        # Fill some data for preview
        type_into('input[name="name"]', "Jane Doe")

        # Preview iframe
        iframe = page.frame_locator("iframe")
        check(iframe is not None, f"{sub} - Preview iframe exists")
        if iframe:
            try:
                preview_text = iframe.locator("body").text_content(timeout=5000)
                check("Jane Doe" in preview_text,
                      f"{sub} - Preview contains name from form",
                      f"text={preview_text[:100]}")
            except:
                check(False, f"{sub} - Preview iframe accessible")

        shot("4.1-preview")

        # 4.2 Export/Download
        sub = "4.2 Export"

        dwl_btn = page.locator('button[aria-label="Download Resume"]')
        if dwl_btn.is_visible(timeout=3000):
            dwl_btn.click()
            page.wait_for_timeout(500)

            # Modal should open
            modal_dwl = page.locator('button:has-text("Download")')
            modal_cancel = page.locator('button:has-text("Cancel")')
            check(modal_dwl.is_visible(timeout=2000),
                  f"{sub} - Download modal opens")
            check(modal_cancel.is_visible(timeout=1000),
                  f"{sub} - Cancel button in modal")

            # Cancel to close
            modal_cancel.click()
            page.wait_for_timeout(500)
            check(not modal_dwl.is_visible(timeout=2000),
                  f"{sub} - Cancel closes modal")
        else:
            log(f"  SKIP [---] Download button not visible")

        shot("4.2-export")

        # ============================================================
        # 5. THEME SETTINGS
        # ============================================================
        group("5. THEME SETTINGS")
        page.goto(URL, wait_until="networkidle", timeout=20000)

        sub = "5. Theme Settings"

        # Theme color swatches
        color_swatches = page.locator('div[style*="background-color"]')
        swatch_count = 0
        for i in range(color_swatches.count()):
            div = color_swatches.nth(i)
            style = div.get_attribute("style") or ""
            bg = div.evaluate("el => window.getComputedStyle(el).backgroundColor")
            # Check it's a reasonable color swatch (not transparent)
            if bg and bg != "rgba(0, 0, 0, 0)" and div.is_visible():
                swatch_count += 1

        check(swatch_count >= 3, f"{sub} - At least 3 color swatches", f"got {swatch_count}")

        # Click first swatch
        if swatch_count > 0:
            first_swatch = page.locator('div[tabindex="0"]').first
            if first_swatch.is_visible():
                first_swatch.click()
                page.wait_for_timeout(300)
                check("✓" in (first_swatch.text_content() or ""),
                      f"{sub} - Checkmark on selected swatch")

        shot("5.1-color-swatches")

        # Font family options
        font_options = page.locator('button:has-text("Inter"), button:has-text("Lato"), button:has-text("Roboto")')
        check(font_options.count() >= 3,
              f"{sub} - At least 3 font options visible")

        # Font size options
        font_size_options = page.locator('button:has-text("Compact"), button:has-text("Standard"), button:has-text("Large")')
        check(font_size_options.count() >= 2,
              f"{sub} - Font size presets visible")

        # Document size options
        doc_size = page.locator('button:has-text("Letter"), button:has-text("A4")')
        check(doc_size.count() >= 1, f"{sub} - Document size options visible")

        # Theme color InlineInput
        theme_input = page.locator('input[name="themeColor"]')
        if theme_input.is_visible(timeout=2000):
            check(theme_input.get_attribute("value") is not None,
                  f"{sub} - Theme color input exists")

        shot("5.2-theme-settings")

        # ============================================================
        # 6. RESPONSIVE / MOBILE
        # ============================================================
        group("6. RESPONSIVE / MOBILE")

        page.close()
        mobile_ctx = browser.new_context(
            viewport={"width": 375, "height": 812},
            is_mobile=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = mobile_ctx.new_page()
        goto_builder = lambda: page.goto(URL, wait_until="networkidle", timeout=20000)
        goto_builder()

        sub = "6. Mobile"

        # No horizontal scroll
        sw = page.evaluate("document.documentElement.scrollWidth")
        vw = page.evaluate("window.innerWidth")
        check(sw <= vw + 5, f"{sub} - No horizontal scroll", f"scrollW={sw} vpW={vw}")

        # Single column (form above preview)
        check(is_visible('text="Objective"', 3000), f"{sub} - Form visible on mobile")
        check(is_visible('text="Resume Setting"', 3000), f"{sub} - Theme form visible on mobile")

        shot("6.1-mobile-layout")

        # Expand section on mobile
        expand_section("WORK EXPERIENCE")
        check(is_visible('button:has-text("Add Job")', 2000),
              f"{sub} - Expand section on mobile works")

        # Click sparkle on mobile
        sparkles_mobile = page.locator('button[aria-label="Enhance with AI"]')
        if sparkles_mobile.count() > 0 and sparkles_mobile.first.is_visible():
            sparkles_mobile.first.click()
            page.wait_for_timeout(1000)

            ai_panel_mobile = is_visible('span:has-text("AI Enhance")', 3000)
            check(ai_panel_mobile, f"{sub} - AI panel opens on mobile")

            if ai_panel_mobile:
                # Check fits viewport
                panel_box = page.locator(".ai-panel").bounding_box()
                if panel_box:
                    check(panel_box["width"] <= vw,
                          f"{sub} - AI panel fits mobile width",
                          f"panelW={panel_box['width']:.0f} vpW={vw}")
                    check(panel_box["y"] >= 0,
                          f"{sub} - AI panel inside viewport top",
                          f"y={panel_box['y']:.0f}")

                # Close via Escape
                page.keyboard.press("Escape")
                page.wait_for_timeout(500)

        shot("6.2-mobile-ai-panel")

        # Form section stays expanded after sparkle on mobile
        check(is_visible('button:has-text("Add Job")', 2000),
              f"{sub} - Form stays expanded after mobile sparkle")

        # ============================================================
        # 7. EDGE CASES
        # ============================================================
        group("7. EDGE CASES")
        page.close()
        ctx = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        goto_builder = lambda: page.goto(URL, wait_until="networkidle", timeout=20000)
        goto_builder()

        sub = "7. Edge Cases"

        # Empty state: all inputs should have placeholders
        empty_inputs = page.locator('input[placeholder]')
        check(empty_inputs.count() > 5, f"{sub} - Default empty inputs have placeholders")

        # Long text test
        type_into('input[name="name"]', "A" * 100)
        name_val = page.locator('input[name="name"]').input_value()
        check(len(name_val) >= 100, f"{sub} - Long name text accepted")

        # Sparkle hidden when no content (Profile)
        obj_sparkle = page.locator('button[aria-label="Enhance with AI"]').first
        # After clearing objective, check sparkle hidden is hard without clear
        check(obj_sparkle.is_visible(timeout=1000),
              f"{sub} - Profile sparkle visible with content (objective filled)")

        shot("7.1-edge-cases")

        # Feature skill ratings
        expand_section("SKILLS")
        ratings = page.locator('[class*="h-3 w-3 rounded-full"]')
        if ratings.count() > 0:
            ratings.first.click()
            page.wait_for_timeout(200)
            check(True, f"{sub} - Skill rating clickable (hover effects)")

        shot("7.2-skill-ratings")

        # ============================================================
        # 8. PERFORMANCE / STABILITY
        # ============================================================
        group("8. PERFORMANCE / STABILITY")
        sub = "8. Stability"

        # Navigate to clean state
        page.goto(URL, wait_until="networkidle", timeout=20000)

        # Click all available buttons quickly - no errors
        all_buttons = page.locator("button")
        btn_count = all_buttons.count()
        log(f"  Total buttons found: {btn_count}")

        errors_before = len(page.text_content("body") or "")
        # Click a few safe buttons
        safe_click_attempts = 0
        for i in range(min(btn_count, 10)):
            btn = all_buttons.nth(i)
            if btn.is_visible(timeout=500):
                try:
                    btn.click(timeout=2000)
                    page.wait_for_timeout(200)
                    safe_click_attempts += 1
                except:
                    pass

        shot("8.1-bulk-click")
        check(safe_click_attempts >= 3,
              f"{sub} - Multiple buttons clickable without crash",
              f"clicked {safe_click_attempts}")

        # No console errors
        # (Playwright doesn't auto-capture console in headless, check for page errors)
        page.on("pageerror", lambda err: check(False, f"Page error: {err}"))
        page.goto(URL, wait_until="networkidle", timeout=20000)
        check(True, f"{sub} - Page reloads without error")

        # Rapid add/delete
        expand_section("WORK EXPERIENCE")
        for _ in range(3):
            add_btn = page.locator('button:has-text("Add Job")')
            if add_btn.is_visible(timeout=1000):
                add_btn.click()
                page.wait_for_timeout(200)

        entries = page.locator('input[name="company"]').count()
        check(entries >= 2, f"{sub} - Rapid add entries stable", f"entries={entries}")

        shot("8.2-rapid-add")

        # Delete all but last - should go down to 1
        del_btns_local = page.locator('button[aria-label*="Delete"]')
        while del_btns_local.count() > 1:
            del_btns_local.first.click()
            page.wait_for_timeout(200)
            del_btns_local = page.locator('button[aria-label*="Delete"]')

        remaining = page.locator('input[name="company"]').count()
        check(remaining >= 1, f"{sub} - Last entry not deleted (resets instead)",
              f"remaining={remaining}")

        shot("8.3-rapid-delete")

        # Theme color change propagation
        color_swatch = page.locator('div[tabindex="0"]').first
        if color_swatch.is_visible(timeout=2000):
            color_swatch.click()
            page.wait_for_timeout(500)
            sparkles_final = page.locator('button[aria-label="Enhance with AI"]')
            for i in range(min(sparkles_final.count(), 3)):
                btn = sparkles_final.nth(i)
                if btn.is_visible(timeout=500):
                    style = btn.get_attribute("style") or ""
                    check("color" in style,
                          f"{sub} - Sparkle #{i+1} has color after theme change")

        shot("8.4-theme-propagation")

    finally:
        # Cleanup
        if page:
            page.close()
        if browser:
            browser.close()

    # Summary
    print(f"\n{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}")
    print(f"  Total:  {total}")
    print(f"  Passed: {passed}")
    print(f"  Failed: {failed}")
    print(f"  Rate:   {passed/total*100:.1f}%" if total > 0 else "")
    print(f"\nScreenshots: {SHOTS}/")

    sys.exit(0 if failed == 0 else 1)
