import { Share2, Link as LinkIcon, MessageSquare, Twitter, Facebook, Linkedin, X } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
    title: string
    text: string
    url: string
    className?: string
}

export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const fullMessage = `${text}\n\nCheck it out here: ${url}`

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                })
            } catch (err) {
                console.error('Error sharing:', err)
                setIsOpen(true)
            }
        } else {
            setIsOpen(true)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageSquare,
            color: 'text-emerald-500',
            href: `https://wa.me/?text=${encodeURIComponent(fullMessage)}`
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'text-sky-500',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'text-blue-600',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'text-blue-700',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        }
    ]

    return (
        <>
            <button
                onClick={handleShare}
                className={`p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-600 dark:text-slate-400 transition-colors ${className}`}
                aria-label="Share"
            >
                <Share2 className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-xs bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/50">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Share Event</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-3 space-y-1">
                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                            >
                                <LinkIcon className="w-4 h-4 text-rose-500" />
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>

                            <div className="h-px bg-slate-100 dark:bg-neutral-800 my-1 mx-2" />

                            {shareLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                                >
                                    <link.icon className={`w-4 h-4 ${link.color}`} />
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
