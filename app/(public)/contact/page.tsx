import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Github, X, Youtube, Send, Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact — SubhanPlays',
  description: 'Get in touch with SubhanPlays — business inquiries, collaboration proposals, or just say hi.',
};

export default function ContactPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display">Contact</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Get In Touch</h2>
            <p className="text-muted-foreground">
              Fill out the form and I'll get back to you as soon as possible. For business inquiries,
              please mention it in the subject.
            </p>

            <form className="space-y-4" id="contact-form">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="business">Business Inquiry</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="technical">Technical Question</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project or inquiry..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" id="submit-btn">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>

            <div id="form-success" className="hidden rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-400">
              Thanks for reaching out! I'll get back to you soon.
            </div>
            <div id="form-error" className="hidden rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
              Something went wrong. Please try again or email directly.
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Other Ways to Connect</h2>
            <div className="space-y-3">
              {[
                { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@NotSubhanplayz', color: 'bg-red-600' },
                { icon: Github, label: 'GitHub', href: 'https://github.com/SubhanPlays', color: 'bg-gray-800' },
                { icon: Mail, label: 'Email', href: 'mailto:contact@subhanplays.qzz.io', color: 'bg-blue-600' },
                { icon: X, label: 'X (Twitter)', href: 'https://x.com/NotSubhanplayz', color: 'bg-black' },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-all group"
                >
                  <div className={contact.color + ' flex h-10 w-10 items-center justify-center rounded-lg text-white'}>
                    <contact.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">{contact.label}</p>
                    <p className="text-sm text-muted-foreground">Click to open</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-3">Response Time</h3>
              <p className="text-muted-foreground text-sm">
                I typically respond within 24-48 hours. For urgent business inquiries, please mention
                "URGENT" in the subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}