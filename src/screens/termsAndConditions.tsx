import React from 'react';
import { useNavigate } from 'react-router-dom';

const termsText = `TalkTwirl Terms & Conditions (T&C)

Effective Date: 01-07-2025
Version: 1.0.1

> By using TalkTwirl, you (“User”) acknowledge and accept these legally binding Terms & Conditions (“Terms”). If you do not agree, you must discontinue use of the application and associated services.

---

1. 📘 Overview of TalkTwirl

TalkTwirl is a public and private social media platform operated for entertainment and communication purposes. Users can share media (photos, videos, twirls), text, and connect with other individuals.

By accessing or using TalkTwirl, you agree that:

You are at least 13 years of age

You will abide by the Community Guidelines

You will not use the platform to engage in any illegal or unethical activities

---

2. ✅ User Rights and Acceptable Use

You may use TalkTwirl to:

Create and maintain a personal account and profile

Share content that is legal, respectful, and appropriate

Report violations or content that appears harmful or abusive

Block or restrict unwanted interactions

---

3. 🚫 Prohibited Content and Activities

The following are strictly prohibited and will result in immediate review, content removal, and/or account action:

A. Illegal or Unsafe Content

You may not post, distribute, or promote:

Nudity, pornography, or sexually explicit content (even if consensual)

Any content involving minors in a sexual or suggestive context (zero tolerance)

Deepfakes or AI-generated nudity of any person

Child sexual abuse material (CSAM)

B. Abuse and Harassment

You may not:

Harass, threaten, stalk, or cyberbully individuals

Incite violence, harm, or hate based on race, gender, orientation, nationality, religion, or disability

Encourage suicide, self-harm, eating disorders, or substance abuse

C. Identity and Deception

You may not:

Create fake or impersonated profiles

Share misleading, doctored, or AI-altered content meant to deceive

Impersonate public figures, law enforcement, or TalkTwirl staff

D. Exploitation or Criminal Use

You may not:

Use the platform for grooming, trafficking, blackmail, or extortion

Engage in sextortion, threats over shared content, or revenge pornography

Monetize inappropriate content through third-party tools

---

4. 🧠 Moderation, AI & Enforcement

TalkTwirl uses a combination of human moderation and automated AI tools to detect harmful or prohibited content. Actions include:

Immediate content suppression

Shadowbanning abusive accounts

Reporting to authorities (when applicable)

Preserving evidence for legal investigations

Enforcement Levels:

Violation Count	Action Taken

1st	Warning (email/app notification)
2nd	Temporary ban (7–30 days)
3rd	Permanent ban and device/IP block
Severe Cases	Instant ban + law enforcement report

---

5. 🛡 Privacy, Security & Legal Access

A. User Privacy

Private chats are encrypted with end-to-end security

TalkTwirl does not sell your data to third parties

B. Safety Overrides

We reserve the right to decrypt and review reported or flagged content only when:

Required by law enforcement

Necessary to prevent immediate harm, suicide, or abuse

Requested via court orders, subpoenas, or government requests

C. Legal Cooperation

We will cooperate fully with any official investigation regarding misuse, harassment, or any form of criminal activity involving our platform.

---

6. 📛 Underage Use

Minimum usage age: 13 years

Users under 18 should use the platform under guidance of a parent/guardian

Accounts found belonging to minors sharing explicit content will be deleted and may be escalated to child protection agencies

---

7. 💬 Reporting System

Users can report:

Profiles

Posts

Comments

Private messages

All reports are reviewed within 48 hours. For emergencies (e.g., harm, threats, minors in danger), email: talktwirl.help@gmail.com.

---

8. ⚖ Legal Liability & Disclaimer

TalkTwirl is not responsible for:

Actions of users on or off the platform

Content viewed, shared, or downloaded by users

Any personal harm, loss, or legal dispute arising from user interaction

In-app purchases or financial losses due to fraud/scams by third-party users

Users are solely responsible for their content and interactions.

---

9. 🔐 Intellectual Property & Content Rights

All original content remains the property of its creator

By posting, you grant TalkTwirl a non-exclusive, royalty-free license to display and distribute your content on the platform

Content copied or stolen from third parties is not permitted

---

10. 🛠 Platform Policy Updates

We may update these Terms at any time to comply with:

Local and international laws

Platform safety standards

User feedback and risk assessments

Significant changes will be communicated via in-app notification and/or email.

---

11. 🚨 Escalation & Emergency Contacts

If you believe someone is in danger, experiencing abuse, or facing mental health crises, please report immediately.

In life-threatening cases, contact local law enforcement before contacting TalkTwirl.

---

12. 📬 Contact

Email: talktwirl.help@gmail.com
Report Portal: In-app Report Button
Business Address: [Add City/State/Country]

---

✅ User Acknowledgement

By signing up and continuing to use TalkTwirl, you acknowledge:

> “I understand and agree to abide by TalkTwirl's Terms & Conditions and Community Guidelines. I am fully responsible for my actions on the platform.”

---

🔐 Developer / Owner Note (Optional for internal use)

> This T&C shields the platform against nudity/harassment legal cases by proactively:

Warning users

Implementing AI + human moderation

Cooperating with police

Rejecting liability for user actions

Enforcing age and consent policies

Holding power to ban, delete, or report users

`;

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #150121 0%, #6A00FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
    }}>
      <div
        style={{
          background: 'rgba(30,0,50,0.97)',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          padding: '32px 18px',
          width: '100%',
          maxWidth: 600,
          minWidth: 0,
          margin: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            left: 18,
            top: 18,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '4px 10px 4px 0',
            borderRadius: 8,
            transition: 'background 0.15s',
          }}
          aria-label="Back"
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>←</span>
        </button>
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 1.1,
          background: 'linear-gradient(90deg, cyan, #6A00FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 18px 0',
          textAlign: 'center',
        }}>
          Terms & Conditions
        </h2>
        <div
          style={{
            width: '100%',
            maxHeight: '60vh',
            overflowY: 'auto',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
            padding: 18,
            color: '#fff',
            fontSize: 16,
            lineHeight: 1.6,
            boxSizing: 'border-box',
            marginBottom: 8,
            whiteSpace: 'pre-wrap',
          }}
        >
          {termsText}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 