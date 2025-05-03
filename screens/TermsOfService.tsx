import { ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function TermsOfServiceScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ height: '100%', padding: 10 }}>
      <Markdown>
        {`
# Terms of Service for Dorara

**Effective Date:** April 13, 2025

Welcome to **Dorara**! By accessing or using our app, website, or any services ("Service"), you agree to the following Terms of Service ("Terms").

Please read them carefully.

---

## 1. Acceptance of Terms

By using Dorara, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the Service.

---

## 2. Description of Service

Dorara offers features including but not limited to:
- To-do lists
- Notes (Markdown-based)
- Calendar and task scheduling
- Routine Tracking
- Bookmarking
- Offline and online sync


You can use the app **offline**, or **online** with Google authentication and optional Google Drive sync.

---

## 3. User Accounts

To access certain features, you may need to sign in using your Google account. You are responsible for maintaining the confidentiality of your login credentials.

---

## 4. Use of the Service

You agree to:
- Use Dorara only for lawful purposes.
- Not misuse or attempt to interfere with the Service.
- Not attempt to gain unauthorized access to other users' data.

---

## 5. Intellectual Property

All content, design, and branding of Dorara are the intellectual property of the developer(s) unless stated otherwise.

Users retain ownership of their content (e.g., notes, tasks), including files stored in Google Drive.

---

## 6. Disclaimer of Warranties

Dorara is provided "as is" without warranty of any kind. We do not guarantee that the Service will be error-free, secure, or always available.

---

## 7. Limitation of Liability

We are not liable for:
- Data loss (always back up important data)
- Damages resulting from the use or inability to use the Service
- Any third-party services linked or integrated into the app

---

## 8. Termination

We reserve the right to terminate or suspend access to the Service at any time, without notice, for violation of these Terms or other valid reasons.

---

## 9. Changes to the Terms

We may update these Terms at any time. Continued use of the Service after changes means you accept the new Terms.

---

## 10. Contact

For questions about these Terms, contact us at:

📧 **[maheshwarivinayak90@gmail.com](mailto:maheshwarivinayak90@gmail.com)**

---


            `}
      </Markdown>
    </ScrollView>
  );
}
