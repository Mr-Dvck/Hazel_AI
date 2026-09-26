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
STATEMENTS_FILE = os.path.join(APP_DIR, "reassurance_statements.json")

DEFAULT_STATEMENTS = [
    "You are safe, deeply loved, and wonderful just as you are.",
    "I'm right downstairs if you want a warm cuddle or hot cocoa.",
    "Whatever happened at school today, you are not alone. We will handle it together.",
    "I'm so proud of your creative courage and kind heart today.",
    "Take all the quiet sanctuary time you need. I love you to the moon and back.",
]


class GuardianDeskApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Hazel Guardian Desk — Reassurance Console")
        self.root.geometry("1100x750")
        self.root.minsize(950, 650)
        self.root.configure(bg="#090a12")

        # Set Window Icon
        if os.path.exists(ICON_PATH):
            try:
                self.root.iconbitmap(ICON_PATH)
            except Exception as e:
                print(f"Could not load iconbitmap: {e}")

        # State
        self.server_url = DEFAULT_SERVER_URL
        self.notes = []
        self.replies = []
        self.seen_note_ids = set()
        self.selected_note = None
        self.is_connected = False
        self.reassurance_statements = self.load_statements()
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
            "text": "#f3f4f6",
            "text_muted": "#9ca3af",
        }

    def load_statements(self):
        if os.path.exists(STATEMENTS_FILE):
            try:
                with open(STATEMENTS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list) and data:
                        return data
            except Exception:
                pass
        return list(DEFAULT_STATEMENTS)

    def save_statements(self):
        try:
            with open(STATEMENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(self.reassurance_statements, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print("Failed to save statements:", e)

    def build_ui(self):
        # 1. Header Frame
        header = tk.Frame(self.root, bg=self.colors["bg_card"], padx=20, pady=12, highlightthickness=1, highlightbackground=self.colors["border"])
        header.pack(fill="x", side="top")

        # Title & Subtitle
        title_box = tk.Frame(header, bg=self.colors["bg_card"])
        title_box.pack(side="left")

        title_lbl = tk.Label(
            title_box,
            text="🌸 Hazel Guardian Desk",
            font=("Segoe UI", 16, "bold"),
            fg="#ffffff",
            bg=self.colors["bg_card"],
        )
        title_lbl.pack(anchor="w")

        sub_lbl = tk.Label(
            title_box,
            text="Two-Way Reassurance Bridge • Tim & Mom's Dedicated Console",
            font=("Segoe UI", 9),
            fg=self.colors["text_muted"],
            bg=self.colors["bg_card"],
        )
        sub_lbl.pack(anchor="w")

        # Header Right Controls
        h_right = tk.Frame(header, bg=self.colors["bg_card"])
        h_right.pack(side="right")

        self.conn_badge = tk.Label(
            h_right,
            text="● Connecting...",
            font=("Segoe UI", 9, "bold"),
            fg=self.colors["amber"],
            bg=self.colors["bg_card"],
            padx=10,
            pady=4,
        )
        self.conn_badge.pack(side="left", padx=5)

        btn_browser = tk.Button(
            h_right,
            text="🌐 Open Web Portal",
            font=("Segoe UI", 9, "bold"),
            bg="#25273c",
            fg="#ffffff",
            activebackground="#3b3d5c",
            activeforeground="#ffffff",
            relief="flat",
            padx=12,
            pady=4,
            command=self.open_web_portal,
        )
        btn_browser.pack(side="left", padx=5)

        btn_refresh = tk.Button(
            h_right,
            text="🔄 Refresh",
            font=("Segoe UI", 9, "bold"),
            bg="#6b21a8",
            fg="#ffffff",
            activebackground="#7e22ce",
            activeforeground="#ffffff",
            relief="flat",
            padx=12,
            pady=4,
            command=self.manual_refresh,
        )
        btn_refresh.pack(side="left", padx=5)

        # 2. Status Strip Frame
        strip = tk.Frame(self.root, bg=self.colors["bg_main"], padx=20, pady=10)
        strip.pack(fill="x")

        # Metric 1: Mood
        self.card_mood = tk.Frame(strip, bg=self.colors["bg_card"], padx=15, pady=8, highlightthickness=1, highlightbackground=self.colors["border"])
        self.card_mood.pack(side="left", fill="both", expand=True, padx=4)
        tk.Label(self.card_mood, text="EMOTIONAL WEATHER", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w")
        self.lbl_mood = tk.Label(self.card_mood, text="Resilient (Score: 80/100)", font=("Segoe UI", 11, "bold"), fg="#ffffff", bg=self.colors["bg_card"])
        self.lbl_mood.pack(anchor="w")

        # Metric 2: Safety
        self.card_safety = tk.Frame(strip, bg=self.colors["bg_card"], padx=15, pady=8, highlightthickness=1, highlightbackground=self.colors["border"])
        self.card_safety.pack(side="left", fill="both", expand=True, padx=4)
        tk.Label(self.card_safety, text="SAFETY SCANNER", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w")
        self.lbl_safety = tk.Label(self.card_safety, text="Safe • No Active Alerts", font=("Segoe UI", 11, "bold"), fg=self.colors["green"], bg=self.colors["bg_card"])
        self.lbl_safety.pack(anchor="w")

        # Metric 3: Bridge Notes Count
        self.card_stats = tk.Frame(strip, bg=self.colors["bg_card"], padx=15, pady=8, highlightthickness=1, highlightbackground=self.colors["border"])
        self.card_stats.pack(side="left", fill="both", expand=True, padx=4)
        tk.Label(self.card_stats, text="BRIDGE INBOX", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w")
        self.lbl_stats = tk.Label(self.card_stats, text="0 Notes Dispatched", font=("Segoe UI", 11, "bold"), fg=self.colors["pink"], bg=self.colors["bg_card"])
        self.lbl_stats.pack(anchor="w")

        # 2b. Live Session Summary Banner Frame
        summary_frame = tk.Frame(self.root, bg=self.colors["bg_card"], padx=15, pady=8, highlightthickness=1, highlightbackground=self.colors["border"])
        summary_frame.pack(fill="x", padx=20, pady=(0, 6))

        sum_hdr = tk.Frame(summary_frame, bg=self.colors["bg_card"])
        sum_hdr.pack(fill="x")
        tk.Label(sum_hdr, text="✨ LIVE COMPANION SESSION SUMMARY", font=("Segoe UI", 8, "bold"), fg=self.colors["purple"], bg=self.colors["bg_card"]).pack(side="left")
        self.lbl_sync_time = tk.Label(sum_hdr, text="Syncing...", font=("Segoe UI", 8), fg=self.colors["text_muted"], bg=self.colors["bg_card"])
        self.lbl_sync_time.pack(side="right")

        self.txt_summary = tk.Text(
            summary_frame,
            height=2,
            bg=self.colors["bg_card"],
            fg="#e5e7eb",
            font=("Segoe UI", 9),
            relief="flat",
            wrap="word",
            highlightthickness=0,
            borderwidth=0,
        )
        self.txt_summary.pack(fill="x", pady=(3, 0))
        self.txt_summary.insert("1.0", "Hazel is in her creative sanctuary. Her companion is validating her emotions and standing by.")
        self.txt_summary.config(state="disabled")

        # 3. Main Split Body (Left: Inbox, Right: Composer & Statements)
        body = tk.Frame(self.root, bg=self.colors["bg_main"], padx=20, pady=5)
        body.pack(fill="both", expand=True)

        # Left Column: Inbox Frame
        left_col = tk.Frame(body, bg=self.colors["bg_card"], highlightthickness=1, highlightbackground=self.colors["border"], padx=15, pady=12)
        left_col.pack(side="left", fill="both", expand=True, padx=(0, 8))

        inbox_hdr = tk.Frame(left_col, bg=self.colors["bg_card"])
        inbox_hdr.pack(fill="x", pady=(0, 8))
        tk.Label(inbox_hdr, text="💌 Dispatched Notes from Hazel", font=("Segoe UI", 11, "bold"), fg="#ffffff", bg=self.colors["bg_card"]).pack(side="left")
        self.lbl_inbox_count = tk.Label(inbox_hdr, text="0 items", font=("Segoe UI", 9), fg=self.colors["text_muted"], bg=self.colors["bg_card"])
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
            font=("Segoe UI", 10),
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
        tk.Label(left_col, text="Selected Note Detail:", font=("Segoe UI", 9, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w", pady=(10, 2))
        self.txt_note_detail = tk.Text(
            left_col,
            height=4,
            bg=self.colors["bg_input"],
            fg="#fbcfe8",
            font=("Segoe UI", 9, "italic"),
            relief="flat",
            highlightthickness=1,
            highlightbackground=self.colors["border"],
            wrap="word",
        )
        self.txt_note_detail.pack(fill="x")
        self.txt_note_detail.insert("1.0", "Select a note from the inbox above to view details and compose a reply...")
        self.txt_note_detail.config(state="disabled")

        # Right Column: Composer & Statement Manager
        right_col = tk.Frame(body, bg=self.colors["bg_card"], highlightthickness=1, highlightbackground=self.colors["border"], padx=15, pady=12)
        right_col.pack(side="right", fill="both", expand=True, padx=(8, 0))

        # Composer Header
        comp_hdr = tk.Frame(right_col, bg=self.colors["bg_card"])
        comp_hdr.pack(fill="x", pady=(0, 6))

        tk.Label(comp_hdr, text="✨ Quick Reassurance Reply", font=("Segoe UI", 11, "bold"), fg="#ffffff", bg=self.colors["bg_card"]).pack(side="left")

        # Sender Selector (Tim / Mom / Both)
        self.sender_var = tk.StringVar(value="Tim (Dad)")
        sender_frame = tk.Frame(comp_hdr, bg=self.colors["bg_card"])
        sender_frame.pack(side="right")

        for s in ["Tim (Dad)", "Mom", "Tim & Mom"]:
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

        # Reassurance Statement One-Click Buttons
        stmts_hdr = tk.Frame(right_col, bg=self.colors["bg_card"])
        stmts_hdr.pack(fill="x", pady=(6, 4))
        tk.Label(stmts_hdr, text="One-Tap Reassurance Statements:", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(side="left")

        btn_add_stmt = tk.Button(
            stmts_hdr,
            text="+ Add Statement",
            font=("Segoe UI", 8, "bold"),
            bg="#25273c",
            fg=self.colors["pink"],
            relief="flat",
            padx=6,
            pady=1,
            command=self.prompt_add_statement,
        )
        btn_add_stmt.pack(side="right")

        # Statements Frame
        self.stmts_frame = tk.Frame(right_col, bg=self.colors["bg_card"])
        self.stmts_frame.pack(fill="x", pady=(0, 8))
        self.render_statement_buttons()

        # Custom Reply Text Area
        tk.Label(right_col, text="Message to Hazel's Screen:", font=("Segoe UI", 9, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w", pady=(4, 2))
        self.txt_reply = tk.Text(
            right_col,
            height=5,
            bg=self.colors["bg_input"],
            fg="#ffffff",
            font=("Segoe UI", 10),
            relief="flat",
            highlightthickness=1,
            highlightbackground=self.colors["border"],
            wrap="word",
            insertbackground="#ffffff",
        )
        self.txt_reply.pack(fill="x", pady=(0, 8))

        # Bottom Action Bar
        act_bar = tk.Frame(right_col, bg=self.colors["bg_card"])
        act_bar.pack(fill="x", pady=4)

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
            padx=16,
            pady=8,
            command=self.send_reply,
        )
        btn_send.pack(side="right")

        # Recent replies list at bottom of right column
        tk.Label(right_col, text="Recent Delivered Notes to Hazel:", font=("Segoe UI", 8, "bold"), fg=self.colors["text_muted"], bg=self.colors["bg_card"]).pack(anchor="w", pady=(10, 2))
        self.replies_listbox = tk.Listbox(
            right_col,
            height=4,
            bg=self.colors["bg_input"],
            fg=self.colors["amber"],
            font=("Segoe UI", 9),
            relief="flat",
            highlightthickness=1,
            highlightbackground=self.colors["border"],
        )
        self.replies_listbox.pack(fill="x")

    def render_statement_buttons(self):
        for widget in self.stmts_frame.winfo_children():
            widget.destroy()

        for stmt in self.reassurance_statements[:4]:
            btn = tk.Button(
                self.stmts_frame,
                text=f'"{stmt}"',
                font=("Segoe UI", 8),
                bg="#1a1c2e",
                fg="#e0e7ff",
                activebackground="#312e81",
                activeforeground="#ffffff",
                relief="flat",
                anchor="w",
                padx=8,
                pady=4,
                command=lambda s=stmt: self.apply_statement(s),
            )
            btn.pack(fill="x", pady=2)

    def apply_statement(self, stmt):
        self.txt_reply.delete("1.0", "end")
        self.txt_reply.insert("1.0", stmt)

    def prompt_add_statement(self):
        dialog = tk.Toplevel(self.root)
        dialog.title("Add Reassurance Statement")
        dialog.geometry("450x180")
        dialog.configure(bg=self.colors["bg_card"])
        dialog.grab_set()

        tk.Label(dialog, text="Enter New Reassurance Statement:", font=("Segoe UI", 10, "bold"), fg="#ffffff", bg=self.colors["bg_card"]).pack(anchor="w", padx=20, pady=(15, 5))

        entry = tk.Entry(dialog, font=("Segoe UI", 10), bg=self.colors["bg_input"], fg="#ffffff", insertbackground="#ffffff")
        entry.pack(fill="x", padx=20, pady=5)
        entry.focus_set()

        def save():
            text = entry.get().strip()
            if text:
                self.reassurance_statements.insert(0, text)
                self.save_statements()
                self.render_statement_buttons()
                dialog.destroy()

        btn_save = tk.Button(dialog, text="Save Statement", font=("Segoe UI", 9, "bold"), bg=self.colors["pink"], fg="#ffffff", relief="flat", command=save)
        btn_save.pack(pady=12)

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
            messagebox.showwarning("Empty Message", "Please type a reassuring message or choose a statement.")
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
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=5) as resp:
                    if resp.status == 200:
                        self.root.after(0, self.on_reply_sent)
            except Exception as e:
                self.root.after(0, lambda: self.lbl_status.config(text=f"Failed: {e}", fg="#ef4444"))

        threading.Thread(target=post, daemon=True).start()

    def on_reply_sent(self):
        self.txt_reply.delete("1.0", "end")
        self.lbl_status.config(text="✨ Reassurance delivered to Hazel's screen!", fg=self.colors["green"])
        if winsound:
            try:
                winsound.MessageBeep(winsound.MB_ICONASTERISK)
            except Exception:
                pass
        self.root.after(3500, lambda: self.lbl_status.config(text=""))
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
            try:
                sync_url = f"{self.server_url}/api/sync?userId=hazel_default"
                req_sync = urllib.request.Request(sync_url, headers={"User-Agent": "HazelGuardianDesk/1.0"})
                with urllib.request.urlopen(req_sync, timeout=4) as resp_sync:
                    sync_data = json.loads(resp_sync.read().decode("utf-8"))
                    if sync_data.get("found") and "guardianInsight" in sync_data.get("data", {}):
                        self.insight = sync_data["data"]["guardianInsight"]
            except Exception:
                pass

            self.is_connected = True

            # Update UI on Main Thread
            self.root.after(0, lambda: self.update_ui(new_note_arrived))
        except Exception as e:
            self.is_connected = False
            self.load_offline_disk_state()
            self.root.after(0, self.update_offline_ui)

    def update_ui(self, alert_new_note=False):
        self.conn_badge.config(text="● Online & Synced", fg=self.colors["green"])
        self.lbl_sync_time.config(text=f"Synced {time.strftime('%I:%M:%S %p')}")

        # Update Live Mood
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

        # Update Live Session Summary
        if self.insight:
            summary = (
                self.insight.get("sessionSummary")
                or self.insight.get("bullyingSafetyAlert", {}).get("summary")
                or self.insight.get("emotionalWeather", {}).get("description")
                or "Hazel is in her creative sanctuary. Her companion is validating her emotions and standing by."
            )
            self.txt_summary.config(state="normal")
            self.txt_summary.delete("1.0", "end")
            self.txt_summary.insert("1.0", summary)
            self.txt_summary.config(state="disabled")

        # Update stats
        self.lbl_stats.config(text=f"{len(self.notes)} Notes • {len(self.replies)} Delivered")
        self.lbl_inbox_count.config(text=f"{len(self.notes)} notes")

        # Update Notes Listbox
        cur_sel = self.notes_listbox.curselection()
        self.notes_listbox.delete(0, "end")
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
        if self.notes or self.insight:
            self.conn_badge.config(text="● Offline (Local State Loaded)", fg=self.colors["amber"])
            self.update_ui(alert_new_note=False)
        else:
            self.conn_badge.config(text="● Waiting for Hazel Server (localhost:3000)", fg=self.colors["amber"])

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
