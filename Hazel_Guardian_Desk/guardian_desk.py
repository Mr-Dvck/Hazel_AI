"""
Hazel Guardian Desk — Dedicated Windows Desktop Application
Two-Way Reassurance Bridge & Live Inbox for Tim & Mom
"""

import sys
import os
import json
import time
import threading
import urllib.request
import urllib.error
import tkinter as tk
from tkinter import ttk, messagebox
import webbrowser

try:
    import winsound
except ImportError:
    winsound = None

# App configuration
DEFAULT_SERVER_URL = "http://localhost:3000"
APP_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(APP_DIR, "assets")
ICON_PATH = os.path.join(ASSETS_DIR, "guardian_desk_logo.ico")
CONFIG_FILE = os.path.join(APP_DIR, "config.json")


def load_config():
    default_config = {
        "server_url": "http://localhost:3000",
        "recent_urls": ["http://localhost:3000", "https://hazel-ai.vercel.app"]
    }
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return {**default_config, **data}
        except Exception as e:
            print(f"Could not load config.json: {e}")
    return default_config


def save_config(cfg):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2)
    except Exception as e:
        print(f"Could not save config.json: {e}")


class GuardianDeskApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Hazel Guardian Desk — Reassurance Console")
        self.root.geometry("1220x900")
        self.root.minsize(1060, 780)
        self.root.configure(bg="#090a12")

        # Set Window Icon
        if os.path.exists(ICON_PATH):
            try:
                self.root.iconbitmap(ICON_PATH)
            except Exception as e:
                print(f"Could not load iconbitmap: {e}")

        # Config & State
        self.config = load_config()
        self.server_url = self.config.get("server_url", DEFAULT_SERVER_URL).rstrip("/")
        self.notes = []
        self.replies = []
        self.seen_note_ids = set()
        self.selected_note = None
        self.is_connected = False
        self.polling_active = True
        self.insight = None

        # Styles
        self.setup_styles()

        # UI Layout
        self.build_ui()

        # Start Polling Thread
        self.poll_thread = threading.Thread(target=self.polling_loop, daemon=True)
        self.poll_thread.start()

    def setup_styles(self):
        self.colors = {
            "bg_main": "#090a12",
            "bg_card": "#131422",
            "bg_input": "#0d0e1a",
            "border": "#25273c",
            "pink": "#ff2e93",
            "purple": "#a855f7",
            "amber": "#fbbf24",
            "green": "#10b981",
            "red": "#ff1744",
            "text": "#f3f4f6",
            "text_muted": "#9ca3af",
        }

    def build_ui(self):
        # 1. Header Frame
        header = tk.Frame(self.root, bg=self.colors["bg_card"], padx=16, pady=10, highlightthickness=1, highlightbackground=self.colors["border"])
        header.pack(fill="x", side="top")

        # Title & Subtitle (Left)
        title_box = tk.Frame(header, bg=self.colors["bg_card"])
        title_box.pack(side="left")

        title_lbl = tk.Label(
            title_box,
            text="🌸 Hazel Guardian Desk",
            font=("Segoe UI", 15, "bold"),
            fg="#ffffff",
            bg=self.colors["bg_card"],
        )
        title_lbl.pack(anchor="w")

        sub_lbl = tk.Label(
            title_box,
            text="Two-Way Reassurance Bridge • Tim & Mom's Console",
            font=("Segoe UI", 9),
            fg=self.colors["text_muted"],
            bg=self.colors["bg_card"],
        )
        sub_lbl.pack(anchor="w")

        # Header Right Controls: Server Switcher, Web Portal & Refresh
        h_right = tk.Frame(header, bg=self.colors["bg_card"])
        h_right.pack(side="right")

        # Server URL selector / input
        srv_frame = tk.Frame(h_right, bg=self.colors["bg_card"])
        srv_frame.pack(side="left", padx=8)

        tk.Label(
            srv_frame,
            text="Target Server:",
            font=("Segoe UI", 8, "bold"),
            fg=self.colors["text_muted"],
            bg=self.colors["bg_card"]
        ).pack(side="left", padx=(0, 4))

        self.server_entry = tk.Entry(
            srv_frame,
            font=("Segoe UI", 9),
            bg=self.colors["bg_input"],
            fg="#ffffff",
            insertbackground="#ffffff",
            width=26,
            highlightthickness=1,
            highlightbackground=self.colors["border"]
        )
        self.server_entry.insert(0, self.server_url)
        self.server_entry.pack(side="left", padx=(0, 4))
        self.server_entry.bind("<Return>", lambda e: self.apply_server_url())

        btn_apply_srv = tk.Button(
            srv_frame,
            text="Connect",
            font=("Segoe UI", 8, "bold"),
            bg="#3b82f6",
            fg="#ffffff",
            relief="flat",
            padx=8,
            pady=2,
            command=self.apply_server_url
        )
        btn_apply_srv.pack(side="left", padx=(0, 4))

        # Quick Toggle Button (Local <-> Vercel)
        self.btn_toggle_srv = tk.Button(
            srv_frame,
            text="☁️ Vercel",
            font=("Segoe UI", 8, "bold"),
            bg="#25273c",
            fg="#38bdf8",
            relief="flat",
            padx=8,
            pady=2,
            command=self.toggle_server_preset
        )
        self.btn_toggle_srv.pack(side="left")

        self.conn_badge = tk.Label(
            h_right,
            text="● Connecting...",
            font=("Segoe UI", 9, "bold"),
            fg=self.colors["amber"],
            bg=self.colors["bg_card"],
            padx=8,
            pady=4,
        )
        self.conn_badge.pack(side="left", padx=4)

        btn_browser = tk.Button(
            h_right,
            text="🌐 Portal",
            font=("Segoe UI", 9, "bold"),
            bg="#25273c",
            fg="#ffffff",
            activebackground="#3b3d5c",
            relief="flat",
            padx=10,
            pady=4,
            command=self.open_web_portal,
        )
        btn_browser.pack(side="left", padx=4)

        btn_refresh = tk.Button(
            h_right,
            text="🔄 Refresh",
            font=("Segoe UI", 9, "bold"),
            bg="#6b21a8",
            fg="#ffffff",
            activebackground="#7e22ce",
            relief="flat",
            padx=10,
            pady=4,
            command=self.manual_refresh,
        )
        btn_refresh.pack(side="left", padx=4)

        # 2. Compact Status Strip
        strip = tk.Frame(self.root, bg=self.colors["bg_main"], padx=20, pady=6)
        strip.pack(fill="x")

        # Metric 1: Mood
        self.card_mood = tk.Frame(strip, bg=self.colors["bg_card"], padx=12, pady=6, highlightthickness=1, highlightbackground=self.colors["border"])
        self.card_mood.pack(side="left", fill="both", expand=True, padx=3)
        tk.Label(self.card_mood, text="EMOTIONAL WEATHER", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w")
        self.lbl_mood = tk.Label(self.card_mood, text="Resilient (Score: 80/100)", font=("Segoe UI", 10, "bold"), fg="#ffffff", bg=self.colors["bg_card"])
        self.lbl_mood.pack(anchor="w")

        # Metric 2: Safety
        self.card_safety = tk.Frame(strip, bg=self.colors["bg_card"], padx=12, pady=6, highlightthickness=1, highlightbackground=self.colors["border"])
        self.card_safety.pack(side="left", fill="both", expand=True, padx=3)
        tk.Label(self.card_safety, text="SAFETY SCANNER", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w")
        self.lbl_safety = tk.Label(self.card_safety, text="Safe • No Active Alerts", font=("Segoe UI", 10, "bold"), fg=self.colors["green"], bg=self.colors["bg_card"])
        self.lbl_safety.pack(anchor="w")

        # Metric 3: Bridge Notes Count
        self.card_stats = tk.Frame(strip, bg=self.colors["bg_card"], padx=12, pady=6, highlightthickness=1, highlightbackground=self.colors["border"])
        self.card_stats.pack(side="left", fill="both", expand=True, padx=3)
        tk.Label(self.card_stats, text="BRIDGE INBOX", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w")
        self.lbl_stats = tk.Label(self.card_stats, text="0 Notes Dispatched", font=("Segoe UI", 10, "bold"), fg=self.colors["pink"], bg=self.colors["bg_card"])
        self.lbl_stats.pack(anchor="w")

        # 3. EXPANDED SECTION: HOW HAZEL IS ACTUALLY DOING (Dropping down to fill upper half)
        self.how_frame = tk.Frame(self.root, bg=self.colors["bg_card"], padx=16, pady=12, highlightthickness=1, highlightbackground="#ec4899")
        self.how_frame.pack(fill="x", padx=20, pady=(0, 6))

        how_hdr = tk.Frame(self.how_frame, bg=self.colors["bg_card"])
        how_hdr.pack(fill="x", pady=(0, 8))

        tk.Label(
            how_hdr,
            text="✨ HOW HAZEL IS ACTUALLY DOING",
            font=("Segoe UI", 11, "bold"),
            fg=self.colors["pink"],
            bg=self.colors["bg_card"],
        ).pack(side="left")

        tk.Label(
            how_hdr,
            text="Real-Time AI Synthesis • Unvarnished Well-Being Assessment",
            font=("Segoe UI", 8),
            fg=self.colors["text_muted"],
            bg=self.colors["bg_card"],
        ).pack(side="left", padx=10)

        self.lbl_sync_time = tk.Label(how_hdr, text="Syncing...", font=("Segoe UI", 8), fg=self.colors["text_muted"], bg=self.colors["bg_card"])
        self.lbl_sync_time.pack(side="right")

        # Waiting banner label
        self.lbl_h_waiting = tk.Label(
            self.how_frame,
            text="\"Waiting for Hazel's first conversation to synthesize her well-being assessment.\"",
            font=("Segoe UI", 10, "italic"),
            fg=self.colors["text_muted"],
            bg=self.colors["bg_card"],
            pady=16,
        )

        # Container for Cards
        self.cards_container = tk.Frame(self.how_frame, bg=self.colors["bg_card"])
        self.cards_container.pack(fill="x")

        # Top Row of Cards (Cards 1, 2, 3)
        cards_row = tk.Frame(self.cards_container, bg=self.colors["bg_card"])
        cards_row.pack(fill="x")

        # Card 1: Current Mood, Energy & Resilience Gauge
        c1 = tk.Frame(cards_row, bg="#181428", highlightthickness=1, highlightbackground="#7c3aed", padx=12, pady=10)
        c1.pack(side="left", fill="both", expand=True, padx=4)

        tk.Label(c1, text="😊 Current Mood & Resilience Gauge", font=("Segoe UI", 9, "bold"), fg="#c084fc", bg="#181428").pack(anchor="w")

        self.lbl_h_mood_title = tk.Label(c1, text="Resilient & Creative", font=("Segoe UI", 11, "bold"), fg="#ffffff", bg="#181428")
        self.lbl_h_mood_title.pack(anchor="w", pady=(4, 2))

        self.lbl_h_resilience_score = tk.Label(c1, text="Resilience Index: 80 / 100", font=("Segoe UI", 9, "bold"), fg=self.colors["pink"], bg="#181428")
        self.lbl_h_resilience_score.pack(anchor="w")

        # Visual Resilience Bar
        self.lbl_h_gauge_bar = tk.Label(c1, text="[████████░░]", font=("Consolas", 11, "bold"), fg=self.colors["green"], bg="#181428")
        self.lbl_h_gauge_bar.pack(anchor="w", pady=(2, 4))

        self.txt_h_mood = tk.Text(c1, height=3, bg="#181428", fg="#e0e7ff", font=("Segoe UI", 8), relief="flat", wrap="word", highlightthickness=0, borderwidth=0)
        self.txt_h_mood.pack(fill="both", expand=True)
        self.txt_h_mood.config(state="disabled")

        # Card 2: What's Weighing On Her (Spacious, full text, never truncated)
        c2 = tk.Frame(cards_row, bg="#241a15", highlightthickness=1, highlightbackground="#d97706", padx=12, pady=10)
        c2.pack(side="left", fill="both", expand=True, padx=4)

        tk.Label(c2, text="🛡️ What's Weighing On Her", font=("Segoe UI", 9, "bold"), fg="#fcd34d", bg="#241a15").pack(anchor="w")
        tk.Label(c2, text="(Full unvarnished context • Never truncated)", font=("Segoe UI", 7), fg=self.colors["text_muted"], bg="#241a15").pack(anchor="w", pady=(0, 4))

        self.txt_h_weighing = tk.Text(c2, height=6, bg="#241a15", fg="#f3f4f6", font=("Segoe UI", 9), relief="flat", wrap="word", highlightthickness=0, borderwidth=0)
        self.txt_h_weighing.pack(fill="both", expand=True)
        self.txt_h_weighing.config(state="disabled")

        # Card 3: What's Bringing Her Joy (Spacious, full text, never truncated)
        c3 = tk.Frame(cards_row, bg="#122329", highlightthickness=1, highlightbackground="#06b6d4", padx=12, pady=10)
        c3.pack(side="left", fill="both", expand=True, padx=4)

        tk.Label(c3, text="💖 What's Bringing Her Joy", font=("Segoe UI", 9, "bold"), fg="#67e8f9", bg="#122329").pack(anchor="w")
        tk.Label(c3, text="(Creativity, monster lore & happy moments)", font=("Segoe UI", 7), fg=self.colors["text_muted"], bg="#122329").pack(anchor="w", pady=(0, 4))

        self.txt_h_joy = tk.Text(c3, height=6, bg="#122329", fg="#f3f4f6", font=("Segoe UI", 9), relief="flat", wrap="word", highlightthickness=0, borderwidth=0)
        self.txt_h_joy.pack(fill="both", expand=True)
        self.txt_h_joy.config(state="disabled")

        # Bottom Row: Card 4 Banner (Plain-English Executive Well-Being Summary)
        c4 = tk.Frame(self.cards_container, bg="#261222", highlightthickness=1, highlightbackground="#ec4899", padx=14, pady=8)
        c4.pack(fill="x", pady=(8, 0))

        tk.Label(
            c4,
            text="✨ Plain-English Executive Well-Being Summary (Synthesized from Recent Chats):",
            font=("Segoe UI", 9, "bold"),
            fg="#f472b6",
            bg="#261222"
        ).pack(anchor="w", pady=(0, 2))

        self.txt_h_summary = tk.Text(c4, height=3, bg="#261222", fg="#fce7f3", font=("Segoe UI", 9), relief="flat", wrap="word", highlightthickness=0, borderwidth=0)
        self.txt_h_summary.pack(fill="x")
        self.txt_h_summary.config(state="disabled")

        # 4. Main Split Body (Left: Inbox, Right: Clean Spacious Custom Note Composer)
        body = tk.Frame(self.root, bg=self.colors["bg_main"], padx=20, pady=4)
        body.pack(fill="both", expand=True)

        # Left Column: Inbox Frame
        left_col = tk.Frame(body, bg=self.colors["bg_card"], highlightthickness=1, highlightbackground=self.colors["border"], padx=14, pady=10)
        left_col.pack(side="left", fill="both", expand=True, padx=(0, 6))

        inbox_hdr = tk.Frame(left_col, bg=self.colors["bg_card"])
        inbox_hdr.pack(fill="x", pady=(0, 6))
        tk.Label(inbox_hdr, text="💌 Dispatched Notes from Hazel", font=("Segoe UI", 10, "bold"), fg="#ffffff", bg=self.colors["bg_card"]).pack(side="left")
        self.lbl_inbox_count = tk.Label(inbox_hdr, text="0 items", font=("Segoe UI", 8), fg=self.colors["text_muted"], bg=self.colors["bg_card"])
        self.lbl_inbox_count.pack(side="right")

        # Notes Listbox & Scrollbar
        list_container = tk.Frame(left_col, bg=self.colors["bg_card"])
        list_container.pack(fill="both", expand=True)

        self.notes_listbox = tk.Listbox(
            list_container,
            bg=self.colors["bg_input"],
            fg="#ffffff",
            selectbackground="#701a75",
            selectforeground="#ffffff",
            font=("Segoe UI", 9),
            highlightthickness=1,
            highlightbackground=self.colors["border"],
            relief="flat",
            activestyle="none",
        )
        self.notes_listbox.pack(side="left", fill="both", expand=True)
        self.notes_listbox.bind("<<ListboxSelect>>", self.on_note_select)

        scroll = tk.Scrollbar(list_container, orient="vertical", command=self.notes_listbox.yview)
        scroll.pack(side="right", fill="y")
        self.notes_listbox.config(yscrollcommand=scroll.set)

        # Selected Note Detail Display
        tk.Label(left_col, text="Selected Note Detail:", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w", pady=(8, 2))
        self.txt_note_detail = tk.Text(
            left_col,
            height=3,
            bg=self.colors["bg_input"],
            fg="#fbcfe8",
            font=("Segoe UI", 9, "italic"),
            relief="flat",
            highlightthickness=1,
            highlightbackground=self.colors["border"],
            wrap="word",
        )
        self.txt_note_detail.pack(fill="x")
        self.txt_note_detail.insert("1.0", "Select a note from the inbox above to view details and write a reply...")
        self.txt_note_detail.config(state="disabled")

        # Right Column: Custom Note Composer (Canned / Pre-written messages completely purged)
        right_col = tk.Frame(body, bg=self.colors["bg_card"], highlightthickness=1, highlightbackground=self.colors["border"], padx=14, pady=10)
        right_col.pack(side="right", fill="both", expand=True, padx=(6, 0))

        # Composer Header
        comp_hdr = tk.Frame(right_col, bg=self.colors["bg_card"])
        comp_hdr.pack(fill="x", pady=(0, 6))

        tk.Label(comp_hdr, text="✍️ Custom Note Composer for Hazel", font=("Segoe UI", 11, "bold"), fg="#ffffff", bg=self.colors["bg_card"]).pack(side="left")

        # Sender Selector (Tim / Mom / Tim & Mom - ZERO references to Tim as Dad)
        self.sender_var = tk.StringVar(value="Tim")
        sender_frame = tk.Frame(comp_hdr, bg=self.colors["bg_card"])
        sender_frame.pack(side="right")

        tk.Label(sender_frame, text="From:", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(side="left", padx=(0, 4))

        for s in ["Tim", "Mom", "Tim & Mom"]:
            r = tk.Radiobutton(
                sender_frame,
                text=s,
                value=s,
                variable=self.sender_var,
                bg=self.colors["bg_card"],
                fg="#ffffff",
                selectcolor="#9d174d",
                activebackground=self.colors["bg_card"],
                activeforeground="#ffffff",
                font=("Segoe UI", 9, "bold"),
            )
            r.pack(side="left", padx=3)

        tk.Label(
            right_col,
            text="Write a genuine, heartfelt note directly to Hazel's screen:",
            font=("Segoe UI", 9, "bold"),
            fg=self.colors["text_muted"],
            bg=self.colors["bg_card"]
        ).pack(anchor="w", pady=(4, 4))

        # Large comfortable message textarea
        self.txt_reply = tk.Text(
            right_col,
            height=7,
            bg=self.colors["bg_input"],
            fg="#ffffff",
            font=("Segoe UI", 10),
            relief="flat",
            highlightthickness=1,
            highlightbackground=self.colors["border"],
            wrap="word",
            insertbackground="#ffffff",
        )
        self.txt_reply.pack(fill="both", expand=True, pady=(0, 8))

        # Bottom Action Bar with big prominent send button
        act_bar = tk.Frame(right_col, bg=self.colors["bg_card"])
        act_bar.pack(fill="x", pady=2)

        self.lbl_status = tk.Label(act_bar, text="", font=("Segoe UI", 9), fg=self.colors["green"], bg=self.colors["bg_card"])
        self.lbl_status.pack(side="left")

        btn_send = tk.Button(
            act_bar,
            text="💌 Send Note to Hazel's Screen",
            font=("Segoe UI", 10, "bold"),
            bg="#db2777",
            fg="#ffffff",
            activebackground="#be185d",
            activeforeground="#ffffff",
            relief="flat",
            padx=18,
            pady=8,
            command=self.send_reply,
        )
        btn_send.pack(side="right")

        # Recent delivered notes feed
        tk.Label(right_col, text="Recent Delivered Notes to Hazel:", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w", pady=(8, 2))
        self.replies_listbox = tk.Listbox(
            right_col,
            height=4,
            bg=self.colors["bg_input"],
            fg=self.colors["amber"],
            font=("Segoe UI", 8),
            relief="flat",
            highlightthickness=1,
            highlightbackground=self.colors["border"],
        )
        self.replies_listbox.pack(fill="x")

    def toggle_server_preset(self):
        current = self.server_entry.get().strip().rstrip("/")
        if "localhost" in current:
            target = "https://hazel-ai.vercel.app"
            self.btn_toggle_srv.config(text="💻 Localhost", fg="#a78bfa")
        else:
            target = "http://localhost:3000"
            self.btn_toggle_srv.config(text="☁️ Vercel", fg="#38bdf8")

        self.server_entry.delete(0, "end")
        self.server_entry.insert(0, target)
        self.apply_server_url()

    def apply_server_url(self):
        new_url = self.server_entry.get().strip().rstrip("/")
        if not new_url:
            new_url = DEFAULT_SERVER_URL
        self.server_url = new_url
        self.config["server_url"] = self.server_url
        recent = self.config.get("recent_urls", [])
        if self.server_url not in recent:
            recent.insert(0, self.server_url)
            self.config["recent_urls"] = recent[:5]
        save_config(self.config)

        self.conn_badge.config(text=f"● Connecting to {self.server_url}...", fg=self.colors["amber"])
        self.manual_refresh()

    def on_note_select(self, event):
        sel = self.notes_listbox.curselection()
        if not sel:
            return
        idx = sel[0]
        if idx < len(self.notes):
            self.selected_note = self.notes[idx]
            self.txt_note_detail.config(state="normal")
            self.txt_note_detail.delete("1.0", "end")
            detail = f"From: {self.selected_note.get('senderName', 'Hazel')}\n"
            detail += f"Time: {time.strftime('%I:%M %p', time.localtime(self.selected_note.get('timestamp', 0) / 1000))}\n"
            detail += f"Note: \"{self.selected_note.get('text', '')}\""
            self.txt_note_detail.insert("1.0", detail)
            self.txt_note_detail.config(state="disabled")

    def send_reply(self):
        msg = self.txt_reply.get("1.0", "end").strip()
        if not msg:
            messagebox.showwarning("Empty Message", "Please type a genuine, heartfelt note for Hazel.")
            return

        sender = self.sender_var.get()
        note_id = self.selected_note.get("id") if self.selected_note else None

        payload = {
            "sender": sender,
            "message": msg,
            "noteId": note_id,
            "reassuranceType": "love",
        }

        def post():
            try:
                url = f"{self.server_url}/api/bridge/reply"
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json", "User-Agent": "HazelGuardianDesk/1.0"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=6) as resp:
                    if resp.status == 200:
                        self.root.after(0, self.on_reply_sent)
            except Exception as e:
                self.root.after(0, lambda: self.lbl_status.config(text=f"Failed: {e}", fg="#ef4444"))

        threading.Thread(target=post, daemon=True).start()

    def on_reply_sent(self):
        self.txt_reply.delete("1.0", "end")
        self.lbl_status.config(text="✨ Note delivered directly to Hazel's screen!", fg=self.colors["green"])
        if winsound:
            try:
                winsound.MessageBeep(winsound.MB_ICONASTERISK)
            except Exception:
                pass
        self.root.after(4000, lambda: self.lbl_status.config(text=""))
        self.manual_refresh()

    def open_web_portal(self):
        webbrowser.open(f"{self.server_url}/guardian/desk")

    def manual_refresh(self):
        threading.Thread(target=self.fetch_all_data, daemon=True).start()

    def load_offline_disk_state(self):
        candidate_dirs = [
            os.path.join(APP_DIR, "..", "data"),
            "D:\\Hazel_AI\\data",
            os.path.join(os.path.expanduser("~"), "Desktop", "Hazel_AI", "data"),
        ]
        for cdir in candidate_dirs:
            if not os.path.exists(cdir):
                continue
            bpath = os.path.join(cdir, "bridge_state.json")
            if os.path.exists(bpath):
                try:
                    with open(bpath, "r", encoding="utf-8") as f:
                        bdata = json.load(f)
                        self.notes = bdata.get("notes", [])
                        self.replies = bdata.get("replies", [])
                except Exception:
                    pass
            spath = os.path.join(cdir, "sync_state.json")
            if os.path.exists(spath):
                try:
                    with open(spath, "r", encoding="utf-8") as f:
                        sdata = json.load(f)
                        hdata = sdata.get("hazel_default", {})
                        if "guardianInsight" in hdata:
                            self.insight = hdata["guardianInsight"]
                except Exception:
                    pass
            break

    def fetch_all_data(self):
        try:
            # 1. Fetch Notes
            notes_url = f"{self.server_url}/api/bridge/dispatch?limit=50"
            req = urllib.request.Request(notes_url, headers={"User-Agent": "HazelGuardianDesk/1.0"})
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                new_notes = data.get("notes", [])

            # Check for new unseen notes
            new_note_arrived = False
            for n in new_notes:
                nid = n.get("id")
                if nid and nid not in self.seen_note_ids:
                    self.seen_note_ids.add(nid)
                    if self.is_connected:
                        new_note_arrived = True

            self.notes = new_notes

            # 2. Fetch Replies
            replies_url = f"{self.server_url}/api/bridge/reply?all=true"
            req = urllib.request.Request(replies_url, headers={"User-Agent": "HazelGuardianDesk/1.0"})
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                self.replies = data.get("replies", [])

            # 3. Fetch Live Guardian Insight & Sync State
            got_insight = False
            try:
                sync_url = f"{self.server_url}/api/sync?userId=hazel_default"
                req_sync = urllib.request.Request(sync_url, headers={"User-Agent": "HazelGuardianDesk/1.0"})
                with urllib.request.urlopen(req_sync, timeout=4) as resp_sync:
                    sync_data = json.loads(resp_sync.read().decode("utf-8"))
                    if sync_data.get("found") and "guardianInsight" in sync_data.get("data", {}):
                        self.insight = sync_data["data"]["guardianInsight"]
                        got_insight = True
            except Exception:
                pass

            if not got_insight:
                try:
                    g_url = f"{self.server_url}/api/guardian"
                    req_g = urllib.request.Request(g_url, headers={"User-Agent": "HazelGuardianDesk/1.0"})
                    with urllib.request.urlopen(req_g, timeout=4) as resp_g:
                        g_data = json.loads(resp_g.read().decode("utf-8"))
                        if g_data.get("success") and "insight" in g_data:
                            self.insight = g_data["insight"]
                except Exception:
                    pass

            self.is_connected = True

            # Update UI on Main Thread
            self.root.after(0, lambda: self.update_ui(new_note_arrived))
        except Exception as e:
            self.is_connected = False
            self.load_offline_disk_state()
            self.root.after(0, self.update_offline_ui)

    def _set_text_widget(self, widget, text):
        widget.config(state="normal")
        widget.delete("1.0", "end")
        widget.insert("1.0", text)
        widget.config(state="disabled")

    def update_ui(self, alert_new_note=False):
        server_display = self.server_url.replace("https://", "").replace("http://", "")
        self.conn_badge.config(text=f"● Online ({server_display})", fg=self.colors["green"])
        self.lbl_sync_time.config(text=f"Synced {time.strftime('%I:%M:%S %p')}")

        # Update Live Mood & Resilience
        score = 80
        mood = "Resilient"
        if self.insight and "emotionalWeather" in self.insight:
            ew = self.insight["emotionalWeather"]
            mood = ew.get("currentMood", "Resilient")
            score = ew.get("score", 80)
            self.lbl_mood.config(text=f"{mood} (Score: {score}/100)")
            if score >= 75:
                self.lbl_mood.config(fg=self.colors["green"])
            elif score >= 50:
                self.lbl_mood.config(fg=self.colors["amber"])
            else:
                self.lbl_mood.config(fg="#ef4444")

        # Update Live Safety
        if self.insight and "bullyingSafetyAlert" in self.insight:
            sa = self.insight["bullyingSafetyAlert"]
            sev = sa.get("severity", "Safe")
            hl = sa.get("headline", "Sanctuary Active")
            color = self.colors["green"] if sev == "Safe" else (self.colors["amber"] if sev in ("Mild", "Moderate") else "#ef4444")
            self.lbl_safety.config(text=f"{sev} • {hl}", fg=color)

        # Update How Hazel Is Actually Doing
        how_data = self.insight.get("howHazelIsDoing") if self.insight else None
        has_convs = True
        if how_data and how_data.get("hasConversations") is False:
            has_convs = False
        elif not self.insight:
            has_convs = False

        if not has_convs:
            self.cards_container.pack_forget()
            self.lbl_h_waiting.pack(fill="x", pady=16)
        else:
            self.lbl_h_waiting.pack_forget()
            self.cards_container.pack(fill="x")

            mood_text = (how_data.get("currentMoodAndEnergy") if how_data else None) or (self.insight.get("emotionalWeather", {}).get("currentMood") if self.insight else "Thoughtful & Calm")
            self.lbl_h_mood_title.config(text=mood_text)
            self.lbl_h_resilience_score.config(text=f"Resilience Index: {score} / 100")

            # Gauge visual bar
            filled_blocks = min(10, max(0, int(score / 10)))
            empty_blocks = 10 - filled_blocks
            bar_str = "[" + ("█" * filled_blocks) + ("░" * empty_blocks) + "]"
            gauge_fg = self.colors["green"] if score >= 75 else (self.colors["amber"] if score >= 50 else self.colors["red"])
            self.lbl_h_gauge_bar.config(text=bar_str, fg=gauge_fg)

            ew_desc = self.insight.get("emotionalWeather", {}).get("description", "Hazel displays strong innate resilience.") if self.insight else ""
            self._set_text_widget(self.txt_h_mood, f"Status: {mood_text}\n{ew_desc}")

            weigh_text = (how_data.get("whatsWeighingOnHer") if how_data else None) or (self.insight.get("bullyingSafetyAlert", {}).get("summary") if self.insight else "No heavy emotional burdens or peer friction detected in recent chats.")
            self._set_text_widget(self.txt_h_weighing, weigh_text)

            joy_text = (how_data.get("whatsBringingHerJoy") if how_data else None) or (self.insight.get("familySentiment", {}).get("summary") if self.insight else "Drawing imaginative creatures, monster lore, and quiet bedtime unwinding.")
            self._set_text_widget(self.txt_h_joy, joy_text)

            exec_text = (how_data.get("parentExecutiveSummary") if how_data else None) or (self.insight.get("sessionSummary") if self.insight else "Hazel is doing well! She is engaging creatively and feeling safe in her space. Acknowledge her ideas and keep encouraging her imagination.")
            self._set_text_widget(self.txt_h_summary, exec_text)

        # Update stats
        self.lbl_stats.config(text=f"{len(self.notes)} Notes • {len(self.replies)} Delivered")
        self.lbl_inbox_count.config(text=f"{len(self.notes)} notes")

        # Update Notes Listbox
        cur_sel = self.notes_listbox.curselection()
        self.notes_listbox.delete(0, "end")
        if not self.notes:
            self.notes_listbox.insert("end", "No notes dispatched yet. When Hazel sends a note to your desk, it will arrive here in real time.")
        else:
            for n in self.notes:
                ts = time.strftime("%I:%M %p", time.localtime(n.get("timestamp", 0) / 1000))
                sender = n.get("senderName", "Hazel")
                status = " [Replied]" if n.get("replied") else " [NEW]"
                text_preview = (n.get("text", "")[:45] + "...") if len(n.get("text", "")) > 45 else n.get("text", "")
                self.notes_listbox.insert("end", f"{ts} - {sender}{status}: \"{text_preview}\"")

            if cur_sel and cur_sel[0] < self.notes_listbox.size():
                self.notes_listbox.selection_set(cur_sel[0])

        # Update Replies Listbox
        self.replies_listbox.delete(0, "end")
        if not self.replies:
            self.replies_listbox.insert("end", "No notes sent to Hazel's screen yet.")
        else:
            for r in self.replies[:6]:
                ts = time.strftime("%I:%M %p", time.localtime(r.get("timestamp", 0) / 1000))
                sender = r.get("sender", "Tim")
                msg = (r.get("message", "")[:50] + "...") if len(r.get("message", "")) > 50 else r.get("message", "")
                self.replies_listbox.insert("end", f"{ts} [{sender}]: \"{msg}\"")

        # Audio chime if new note arrived
        if alert_new_note and winsound:
            try:
                winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
            except Exception:
                pass

    def update_offline_ui(self):
        server_display = self.server_url.replace("https://", "").replace("http://", "")
        if self.notes or self.insight:
            self.conn_badge.config(text=f"● Offline: Local Cache Loaded ({server_display})", fg=self.colors["amber"])
        else:
            self.conn_badge.config(text=f"● Offline: Cannot reach {server_display}", fg=self.colors["red"])
        self.update_ui(alert_new_note=False)

    def polling_loop(self):
        while self.polling_active:
            self.fetch_all_data()
            time.sleep(3)


def main():
    root = tk.Tk()
    app = GuardianDeskApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
