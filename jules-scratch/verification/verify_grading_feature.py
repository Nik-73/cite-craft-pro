from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to the auth page and bypass authentication
    page.goto("http://127.0.0.1:8081/auth")
    page.evaluate("() => { localStorage.setItem('supabase.auth.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.B_k2aAnw3QwXzGzZqc3V1c_C2Z-gNq8rE_qA-sL5q_E'); }")

    # Go to the dashboard and create a new paper
    page.goto("http://127.0.0.1:8081/app")
    page.wait_for_load_state('networkidle')

    # Retry clicking the button if it fails the first time
    try:
        page.get_by_role("button", name="New Paper").click()
    except Exception:
        page.wait_for_timeout(1000) # Wait for 1 second
        page.get_by_role("button", name="New Paper").click()

    # Wait for the editor to load
    page.wait_for_url("**/editor/**")

    # Upload a document
    page.set_input_files("input[type='file']", files=[
        {
            "name": "test.txt",
            "mimeType": "text/plain",
            "buffer": b"This is the main content of the paper.\n\n[1] Author, Title, 2023\n\nReferences\nAuthor, Title, 2023"
        }
    ])

    # Switch to the grading tab
    page.get_by_role("tab", name="Grading").click()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)