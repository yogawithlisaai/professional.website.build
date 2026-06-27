/* ============================================================
   GA4 Events Tracking — Yoga with Lisa
   Paste this script just before </body> on every HTML page
   ============================================================ */

(function () {

  /* ── Utility ── */
  function sendEvent(name, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', name, params || {});
  }

  /* ══════════════════════════════════════════════════════════
     1. WAITLIST SIGNUP
     Fires when waitlist form is successfully submitted
     Pages: waitlist.html
  ══════════════════════════════════════════════════════════ */
  var waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', function () {
      sendEvent('waitlist_signup', { method: 'email_form' });
    });
  }

  /* ══════════════════════════════════════════════════════════
     2. BOOK A CALL CLICK
     Fires when any Calendly link is clicked
     Pages: all pages (footer + connect section)
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href*="calendly.com"]').forEach(function (el) {
    el.addEventListener('click', function () {
      sendEvent('book_a_call_click', { link_url: el.href });
    });
  });

  /* ══════════════════════════════════════════════════════════
     3. MEMBERSHIP CLICK
     Fires when any membership/waitlist CTA on viewplans.html is clicked
     Pages: viewplans.html
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.plan-actions .btn-primary').forEach(function (el) {
    el.addEventListener('click', function () {
      var planTitle = el.closest('.plan') ? el.closest('.plan').querySelector('.plan-title') : null;
      sendEvent('membership_click', {
        plan_name: planTitle ? planTitle.textContent.trim() : 'unknown'
      });
    });
  });

  /* ══════════════════════════════════════════════════════════
     4. RETREAT INQUIRY
     Fires when Aethera (retreat) link is clicked
     Pages: all pages (nav + footer)
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href*="aetherayoga.com"]').forEach(function (el) {
    el.addEventListener('click', function () {
      sendEvent('retreat_inquiry', { link_url: el.href });
    });
  });

  /* ══════════════════════════════════════════════════════════
     5. CLASS BOOKING CLICK
     Fires when "join" button on class schedule is clicked
     Pages: index.html, yoga-inperson.html
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.schedule-btn, a[href*="signup.html"]').forEach(function (el) {
    el.addEventListener('click', function () {
      sendEvent('class_booking_click', { link_url: el.href });
    });
  });

  /* ══════════════════════════════════════════════════════════
     6. VIDEO PLAY
     Fires when any YouTube video link is clicked
     Pages: yoga-ondemand.html
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach(function (el) {
    el.addEventListener('click', function () {
      var title = el.closest('.vcard') ? el.closest('.vcard').querySelector('.vcard__title') : null;
      sendEvent('video_play', {
        video_title: title ? title.textContent.trim() : 'unknown',
        link_url: el.href
      });
    });
  });

  /* ══════════════════════════════════════════════════════════
     7. ON DEMAND CLASS CLICK
     Fires when any on-demand class card button is clicked
     Pages: yoga-ondemand.html
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.vcard__btn').forEach(function (el) {
    el.addEventListener('click', function () {
      var title = el.closest('.vcard') ? el.closest('.vcard').querySelector('.vcard__title') : null;
      sendEvent('on_demand_class_click', {
        class_title: title ? title.textContent.trim() : 'unknown'
      });
    });
  });

  /* ══════════════════════════════════════════════════════════
     8 & 9. SCROLL DEPTH 50% and 90%
     Fires when user scrolls to 50% and 90% of page
     Pages: all pages
  ══════════════════════════════════════════════════════════ */
  var scrollFired = { 50: false, 90: false };
  window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);

    if (!scrollFired[50] && pct >= 50) {
      scrollFired[50] = true;
      sendEvent('scroll_depth_50', { page: window.location.pathname });
    }
    if (!scrollFired[90] && pct >= 90) {
      scrollFired[90] = true;
      sendEvent('scroll_depth_90', { page: window.location.pathname });
    }
  }, { passive: true });

  /* ══════════════════════════════════════════════════════════
     10. FAQ EXPAND
     Fires when FAQ item is expanded (for future FAQ section)
     Pages: any page with FAQ
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.faq-item, details').forEach(function (el) {
    el.addEventListener('toggle', function () {
      if (el.open) {
        var question = el.querySelector('summary, .faq-question');
        sendEvent('faq_expand', {
          question: question ? question.textContent.trim() : 'unknown'
        });
      }
    });
    /* Also handle click-based FAQ toggles */
    var trigger = el.querySelector('.faq-question, .faq-toggle');
    if (trigger) {
      trigger.addEventListener('click', function () {
        var question = trigger.textContent.trim();
        sendEvent('faq_expand', { question: question });
      });
    }
  });

  /* ══════════════════════════════════════════════════════════
     11. ABOUT PAGE VIEW
     Fires on founder.html page load
     Pages: founder.html
  ══════════════════════════════════════════════════════════ */
  if (window.location.pathname.indexOf('founder') !== -1) {
    sendEvent('about_page_view');
  }

  /* ══════════════════════════════════════════════════════════
     12. BLOG POST READ (scroll 80% on blog pages)
     Fires when user reads 80% of a blog post
     Pages: future blog pages
  ══════════════════════════════════════════════════════════ */
  var isBlogPost = window.location.pathname.indexOf('/blog/') !== -1 ||
                   document.querySelector('article.blog-post, .post-content');
  if (isBlogPost) {
    var blogReadFired = false;
    window.addEventListener('scroll', function () {
      if (blogReadFired) return;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = Math.round((scrollTop / docHeight) * 100);
      if (pct >= 80) {
        blogReadFired = true;
        sendEvent('blog_post_read', {
          post_title: document.title,
          page: window.location.pathname
        });
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     13. BLOG CTA CLICK
     Fires when CTA button inside blog post is clicked
     Pages: future blog pages
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.blog-cta, .post-content .btn, article.blog-post .btn').forEach(function (el) {
    el.addEventListener('click', function () {
      sendEvent('blog_cta_click', {
        cta_text: el.textContent.trim(),
        page: window.location.pathname
      });
    });
  });

  /* ══════════════════════════════════════════════════════════
     14. EMAIL SUBSCRIBE
     Fires on waitlist form submit AND any newsletter form
     Pages: waitlist.html + any page with subscribe form
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('form[id*="subscribe"], form[id*="newsletter"], #waitlist-form').forEach(function (form) {
    form.addEventListener('submit', function () {
      sendEvent('email_subscribe', { page: window.location.pathname });
    });
  });

  /* ══════════════════════════════════════════════════════════
     15. SOCIAL SHARE CLICK
     Fires when Instagram or YouTube icon is clicked
     Pages: all pages
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href*="instagram.com"], a[href*="youtube.com/@"]').forEach(function (el) {
    el.addEventListener('click', function () {
      var platform = el.href.indexOf('instagram') !== -1 ? 'instagram' : 'youtube';
      sendEvent('social_share_click', {
        platform: platform,
        link_url: el.href
      });
    });
  });

  /* ══════════════════════════════════════════════════════════
     16. MINDSHIFT PAGE VIEW
     Fires on mindshift.html page load
     Pages: mindshift.html
  ══════════════════════════════════════════════════════════ */
  if (window.location.pathname.indexOf('mindshift') !== -1) {
    sendEvent('mindshift_page_view');
  }

  /* ══════════════════════════════════════════════════════════
     17. RETREAT PAGE VIEW
     Fires when Aethera retreat link is clicked (external site)
     Pages: all pages
  ══════════════════════════════════════════════════════════ */
  if (window.location.pathname.indexOf('retreat') !== -1 ||
      window.location.pathname.indexOf('aethera') !== -1) {
    sendEvent('retreat_page_view');
  }

  /* ══════════════════════════════════════════════════════════
     18. FOUNDER SCHEMA VIEW
     Fires on founder.html page load (schema/structured data view)
     Pages: founder.html
  ══════════════════════════════════════════════════════════ */
  if (window.location.pathname.indexOf('founder') !== -1) {
    sendEvent('founder_schema_view');
  }

})();
