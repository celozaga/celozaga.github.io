---
layout: default
title: Contact
permalink: /contact/
---

<div class="contact-container">
  <form action="https://formspree.io/f/xeejbqbo" method="POST" class="contact-form">
    
    <div class="form-row">
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" placeholder="Your full name" required minlength="2" class="form-input" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" required class="form-input" />
      </div>
    </div>

    <div class="form-group">
      <label for="subject">Subject</label>
      <input id="subject" name="subject" type="text" placeholder="Subject" required class="form-input" />
    </div>

    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" placeholder="Write your message here..." required class="form-textarea"></textarea>
    </div>

    <div class="form-actions">
      <button type="submit" class="form-btn">Send Message</button>
      <div class="note">Or send directly to <strong>celozaga@outlook.com</strong></div>
    </div>
  </form>
</div>
