import Link from 'next/link';
import { Github, Discord, X, Youtube, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const socialLinks = [
  { href: 'https://www.youtube.com/@NotSubhanplayz', label: 'YouTube', icon: Youtube },
  { href: 'https://github.com/SubhanPlays', label: 'GitHub', icon: Github },
  { href: 'https://discord.gg/subhanplays', label: 'Discord', icon: Discord },
  { href: 'https://x.com/NotSubhanplayz', label: 'X', icon: X },
  { href: 'mailto:contact@subhanplays.qzz.io', label: 'Email', icon: Mail },
];

const footerLinks = {
  Content: [
    { href: '/videos', label: 'Videos' },
    { href: '/projects', label: 'Projects' },
    { href: '/roadmap', label: 'Roadmap' },
  ],
  About: [
    { href: '/about', label: 'About Me' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight font-display">
              SUBHANPLAYS
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Gaming, coding, and technology. Building servers, software, and digital experiences.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-muted-foreground transition-colors hover:text-foreground',
                    social.label === 'Email' && 'hover:text-primary'
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} SubhanPlays. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}