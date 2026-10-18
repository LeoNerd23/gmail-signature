"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ImagePlus,
  Link2,
  Mail,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Fields = {
  firstName: string
  lastName: string
  role: string
  department: string
  company: string
  phone: string
  email: string
  secondaryEmail: string
  mobile: string
  website: string
  address: string
  legalNotice: string
  linkedin: string
  facebook: string
  instagram: string
  lattes: string
  x: string
  whatsapp: string
}
type Style = {
  divider: string
  nameColor: string
  legalColor: string
  font: string
  size: number
}
const textColor = "#000000"
const initial: Fields = {
  firstName: "",
  lastName: "",
  role: "",
  department: "",
  company: "",
  phone: "",
  email: "",
  secondaryEmail: "",
  mobile: "",
  website: "",
  address: "",
  legalNotice: "",
  linkedin: "",
  facebook: "",
  instagram: "",
  lattes: "",
  x: "",
  whatsapp: "",
}
const titles = [
  "Dados pessoais",
  "Logo da empresa",
  "Personalize",
  "Escolha seu modelo",
]
const fonts = ["Arial", "Georgia", "Verdana", "Tahoma", "Trebuchet MS"]
const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("55") && digits.length > 11) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (!digits) return ""
  if (digits.length <= 2) return `(${digits}`
  const areaCode = `(${digits.slice(0, 2)}) `
  const subscriber = digits.slice(2)
  if (subscriber.length <= 4) return areaCode + subscriber
  const splitAt = digits.length > 10 ? 5 : 4
  return (
    areaCode + subscriber.slice(0, splitAt) + "-" + subscriber.slice(splitAt)
  )
}
const formatWhatsAppPhone = (value: string) => {
  const hasCountryPrefix = value.trimStart().startsWith("+55")
  let digits = value.replace(/\D/g, "")
  if (hasCountryPrefix) digits = digits.slice(2)
  if (!digits) return ""
  let country = "+55 "
  if (!hasCountryPrefix && digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2)
  }
  digits = digits.slice(0, 11)
  if (digits.length <= 2)
    return country + "(" + digits + (digits.length === 2 ? ")" : "")
  const areaCode = "(" + digits.slice(0, 2) + ") "
  const subscriber = digits.slice(2)
  if (subscriber.length <= 4) return country + areaCode + subscriber
  const splitAt = digits.length > 10 ? 5 : 4
  return (
    country +
    areaCode +
    subscriber.slice(0, splitAt) +
    "-" +
    subscriber.slice(splitAt)
  )
}
const socialHref = (url: string, label?: string) => {
  if (label === "WhatsApp") {
    let digits = url.replace(/\D/g, "")
    if (digits && !digits.startsWith("55")) digits = `55${digits}`
    return `https://wa.me/${digits}`
  }
  return /^https?:|^mailto:|^tel:/i.test(url) ? url : `https://${url}`
}
const publicAssetBase = "https://gmail-signature-umber.vercel.app"
const socialIconPaths: Record<string, string> = {
  LinkedIn: "/icons/linkedin.png",
  Facebook: "/icons/facebook.png",
  Instagram: "/icons/instagram.png",
  X: "/icons/twitter.png",
  WhatsApp: "/icons/whatsapp.png",
}
const contactIconPaths: Record<string, string> = {
  email: "/icons/email.png",
  secondaryEmail: "/icons/email.png",
  phone: "/icons/phone.png",
  mobile: "/icons/smartphone.png",
  website: "/icons/internet.png",
  address: "/icons/pin.png",
}
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }
    return entities[character]
  })
const renderMarkdownInline = (source: string, color: string) => {
  const protectedParts: string[] = []
  const protect = (html: string) => {
    protectedParts.push(html)
    return `\u0000${protectedParts.length - 1}\u0000`
  }
  let text = source.replace(/`([^`]+)`/g, (_, code: string) =>
    protect(
      `<code style="font-family:monospace;background:#f3f3f3;padding:1px 3px">${escapeHtml(code)}</code>`
    )
  )
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, rawUrl: string) => {
    const href = /^www\./i.test(rawUrl) ? `https://${rawUrl}` : rawUrl
    if (!/^(https?:\/\/|mailto:)/i.test(href)) return match
    return protect(
      `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" style="color:${color};text-decoration:underline">${escapeHtml(label)}</a>`
    )
  })
  text = escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1<em>$2</em>")
  return text.replace(/\u0000(\d+)\u0000/g, (_, index: string) =>
    protectedParts[Number(index)]
  )
}
const renderMarkdown = (source: string, color: string) => {
  const lines = source.replace(/\r\n?/g, "\n").split("\n")
  const blocks: string[] = []
  let paragraph: string[] = []
  let listType: "ul" | "ol" | null = null
  let listItems: string[] = []
  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push(
      `<div style="margin:0 0 5px">${paragraph
        .map((line) => renderMarkdownInline(line, color))
        .join("<br>")}</div>`
    )
    paragraph = []
  }
  const flushList = () => {
    if (listType && listItems.length) {
      blocks.push(
        `<${listType} style="margin:3px 0 6px 18px;padding:0">${listItems
          .map((item) => `<li>${renderMarkdownInline(item, color)}</li>`)
          .join("")}</${listType}>`
      )
    }
    listType = null
    listItems = []
  }
  for (const line of lines) {
    const heading = line.match(/^#{1,3}\s+(.+)$/)
    const list = line.match(/^\s*(?:[-+*]\s+|\d+\.\s+)(.*)$/)
    if (!line.trim()) {
      flushParagraph()
      flushList()
    } else if (heading) {
      flushParagraph()
      flushList()
      blocks.push(
        `<div style="margin:2px 0 5px;font-weight:bold">${renderMarkdownInline(heading[1], color)}</div>`
      )
    } else if (list) {
      flushParagraph()
      const nextType = /^\s*\d+\./.test(line) ? "ol" : "ul"
      if (listType && listType !== nextType) flushList()
      listType = nextType
      listItems.push(list[1])
    } else if (/^>\s?/.test(line)) {
      flushParagraph()
      flushList()
      blocks.push(
        `<div style="margin:3px 0;padding-left:8px;border-left:2px solid ${color}">${renderMarkdownInline(line.replace(/^>\s?/, ""), color)}</div>`
      )
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()
  return blocks.join("")
}
const socialIconPath = (name: string) =>
  name.startsWith("Curr")
    ? "/icons/pin-espiral-preto.png"
    : socialIconPaths[name]
const socialGlyph = (name: string) => {
  const src = socialIconPath(name)
  return src ? (
    <img className="provided-social-icon" src={src} alt="" />
  ) : (
    <b className="flat-social-mark">{name.startsWith("Curr") ? "L" : "WA"}</b>
  )
}
const socialMark = (name: string) =>
  name.startsWith("Curr") ? "L" : ""
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [hex, setHex] = useState(value.toUpperCase())
  useEffect(() => setHex(value.toUpperCase()), [value])
  const commitHex = () => {
    if (/^#[\da-f]{6}$/i.test(hex)) onChange(hex)
    else setHex(value.toUpperCase())
  }
  return (
    <div className="style-control">
      <span className="style-label">{label}</span>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" className="color-trigger" type="button">
              <i style={{ backgroundColor: value }} />
              {value.toUpperCase()}
              <ChevronDown size={14} />
            </Button>
          }
        />
        <PopoverContent align="start" className="color-popover">
          <div className="color-popover-title">{label}</div>
          <div className="color-popover-current">
            <input
              type="color"
              aria-label={`${label}: seletor de cor`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <Input
              aria-label={`${label}: código hexadecimal`}
              value={hex}
              maxLength={7}
              onChange={(e) => setHex(e.target.value)}
              onBlur={commitHex}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitHex()
              }}
            />
          </div>
          <div className="color-swatches">
            {[
              "#233634",
              "#475569",
              "#283a68",
              "#594236",
              "#087e72",
              "#3867c8",
              "#b85437",
              "#7252a3",
            ].map((color) => (
              <button
                aria-label={color}
                key={color}
                type="button"
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Page() {
  const [fields, setFields] = useState<Fields>(initial)
  const [logo, setLogo] = useState("")
  const [style, setStyle] = useState<Style>({
    divider: "#d9e3e2",
    nameColor: "#087e72",
    legalColor: "#000000",
    font: "Arial",
    size: 14,
  })
  const [template, setTemplate] = useState(0)
  const [step, setStep] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const fullName = `${fields.firstName} ${fields.lastName}`.trim()
  const contact = useMemo(
    () =>
      [
        fields.email && ["email", fields.email],
        fields.secondaryEmail && ["secondaryEmail", fields.secondaryEmail],
        fields.phone && ["phone", fields.phone],
        fields.mobile && ["mobile", fields.mobile],
        fields.website && ["website", fields.website],
        fields.address && ["address", fields.address],
      ].filter(Boolean) as [string, string][],
    [fields]
  )
  const socials = [
    fields.linkedin && ["in", "LinkedIn", fields.linkedin],
    fields.facebook && ["f", "Facebook", fields.facebook],
    fields.instagram && ["?", "Instagram", fields.instagram],
    fields.lattes && ["L", "Currículo Lattes", fields.lattes],
    fields.x && ["??", "X", fields.x],
    fields.whatsapp && ["?", "WhatsApp", fields.whatsapp],
  ].filter(Boolean) as [string, string, string][]
  const update = (key: keyof Fields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }))
  const clean = () => {
    setFields(initial)
    setLogo("")
    setStyle({
      divider: "#d9e3e2",
      nameColor: "#087e72",
      legalColor: "#000000",
      font: "Arial",
      size: 14,
    })
    setTemplate(0)
    setStep(0)
    setError(false)
    setCopied(false)
  }
  const makeHtml = (assetBase = publicAssetBase) => {
    const name = escapeHtml(fullName || "Seu nome aqui")
    const details = [
      [fields.role, fields.department].filter(Boolean).join(" · "),
      fields.company,
    ]
      .filter(Boolean)
      .map(
        (line) =>
          `<div style="margin-top:5px;color:${textColor}">${escapeHtml(line)}</div>`
      )
      .join("")
    const rows = contact
      .map(
        ([kind, value]) => {
          const safeValue = escapeHtml(value)
          const contactIcon = contactIconPaths[kind]
            ? `<img src="${assetBase}${contactIconPaths[kind]}" width="14" height="14" alt="" style="display:inline-block;width:14px;height:14px;margin-right:5px;border:0;vertical-align:middle">`
            : `<span style="display:inline-block;margin-right:5px;color:${textColor};font-size:9px;font-weight:bold;vertical-align:middle">WWW</span>`
          const contactValue =
            kind === "email" || kind === "secondaryEmail"
              ? `<a href="mailto:${safeValue}" style="color:${textColor};text-decoration:none">${safeValue}</a>`
              : kind === "website"
                ? `<a href="${escapeHtml(socialHref(value))}" target="_blank" rel="noopener noreferrer" style="color:${textColor};text-decoration:none">${safeValue}</a>`
                : safeValue
          return `<span style="display:inline-block;vertical-align:middle;margin:0 14px 4px 0;white-space:nowrap">${contactIcon}<span style="color:${textColor};vertical-align:middle">${contactValue}</span></span>`
        }
      )
      .join("")
    const picture = logo
      ? `<img src="${escapeHtml(logo)}" width="90" height="54" alt="Logo" style="display:block;width:90px;height:54px;border:0;object-fit:contain">`
      : ""
    const network = socials
      .map(
        ([, label, url]) => {
          const iconPath = socialIconPath(label)
          const icon = iconPath
            ? `<img src="${assetBase}${iconPath}" width="15" height="15" alt="${label}" style="display:inline-block;width:15px;height:15px;border:0;vertical-align:middle">`
            : socialMark(label)
          return `<a href="${escapeHtml(socialHref(url, label))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}" style="display:inline-block;width:24px;height:24px;line-height:22px;text-align:center;vertical-align:middle;margin:0 5px 0 0;color:#000;background-color:#ffffff;border:1px solid #dddddd;border-radius:4px;text-decoration:none;font-family:Arial,sans-serif;font-size:10px;font-weight:bold">${icon}</a>`
        }
      )
      .join("")
    const person = `<span style="font-size:${style.size * 1.15}px;font-weight:bold;color:${style.nameColor};line-height:1.3">${name}</span>${details}`
    const base = `font-family:${style.font},Arial,sans-serif;font-size:${style.size}px;color:${textColor};line-height:1.45`
    const centered = `<table cellpadding="0" cellspacing="0" border="0" align="center" style="${base};border-collapse:collapse;text-align:center"><tr><td align="center" style="padding:0 0 8px">${picture}</td></tr><tr><td align="center">${person}</td></tr>${rows ? `<tr><td align="center" style="padding-top:10px;border-top:2px solid ${style.divider}">${rows}</td></tr>` : ""}${network ? `<tr><td align="center" style="padding-top:8px">${network}</td></tr>` : ""}</table>`
    const horizontal = `<table cellpadding="0" cellspacing="0" border="0" style="${base};border-collapse:collapse"><tr>${picture ? `<td width="90" valign="middle" style="width:90px;padding:2px 15px 2px 0">${picture}</td>` : ""}<td valign="middle" style="${picture ? `border-left:2px solid ${style.divider};padding:2px 0 2px 15px` : "padding:2px 0"}">${person}</td></tr>${rows ? `<tr><td colspan="2" style="padding-top:10px;border-top:1px solid #edf0ef">${rows}</td></tr>` : ""}${network ? `<tr><td colspan="2" style="padding-top:8px">${network}</td></tr>` : ""}</table>`
    const reversed = `<table cellpadding="0" cellspacing="0" border="0" style="${base};border-collapse:collapse"><tr><td valign="middle" align="right" style="${picture ? `border-right:2px solid ${style.divider};padding:2px 15px 2px 0` : "padding:2px 0"}">${person}</td>${picture ? `<td width="90" valign="middle" align="center" style="width:90px;padding:2px 0 2px 18px">${picture}</td>` : ""}</tr>${rows ? `<tr><td colspan="2" align="right" style="padding-top:9px">${rows}</td></tr>` : ""}${network ? `<tr><td colspan="2" align="right" style="padding-top:8px">${network}</td></tr>` : ""}</table>`
    const profile = template === 1 ? centered : template === 2 ? reversed : horizontal
    const legalFooter = fields.legalNotice.trim()
      ? `<div style="margin-top:10px;padding-top:7px;border-top:1px solid ${style.divider};font-family:${style.font},Arial,sans-serif;font-size:10px;line-height:1.4;color:${style.legalColor}">${renderMarkdown(fields.legalNotice, style.legalColor)}</div>`
      : ""
    return profile + legalFooter
  }
  const copy = async () => {
    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError(true)
      setStep(0)
      return
    }
    setError(false)
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([makeHtml()], { type: "text/html" }),
          "text/plain": new Blob(
            [
              `${fullName}${fields.role ? ` | ${fields.role}` : ""}\n${contact.map((x) => x[1]).join(" | ")}${fields.legalNotice ? `\n\n${fields.legalNotice}` : ""}`,
            ],
            { type: "text/plain" }
          ),
        }),
      ])
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Preserve rich HTML (including its anchors) when ClipboardItem is unavailable.
      const container = document.createElement("div")
      container.innerHTML = makeHtml()
      container.style.position = "fixed"
      container.style.left = "-9999px"
      document.body.appendChild(container)
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(container)
      selection?.removeAllRanges()
      selection?.addRange(range)
      const copied = document.execCommand("copy")
      selection?.removeAllRanges()
      container.remove()
      if (!copied) throw new Error("Não foi possível copiar a assinatura formatada")
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    }
  }
  const input = (
    key: keyof Fields,
    label: string,
    required = false,
    placeholder?: string,
    type = "text"
  ) => (
    <label className="field" key={key}>
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <Input
        className="field-input"
        value={fields[key]}
        onChange={(e) =>
          update(
            key,
            type === "tel" ? formatPhone(e.target.value) : e.target.value
          )
        }
        placeholder={placeholder ?? label}
        type={type}
      />
    </label>
  )
  const socialInputs = [
    ["linkedin", "LinkedIn", "in"],
    ["facebook", "Facebook", "f"],
    ["instagram", "Instagram", "ig"],
    ["lattes", "Currículo Lattes", "L"],
    ["x", "X", "X"],
    ["whatsapp", "WhatsApp", "wa"],
  ] as [keyof Fields, string, string][]
  const fieldsComplete = !!fields.firstName.trim() && !!fields.lastName.trim()

  return (
    <main className="app-shell">
      <aside className="editor">
        <div className="brand">
          <div className="brand-icon">
            <Mail size={19} />
          </div>
          <span>
            assinatura<span className="brand-accent">.studio</span>
          </span>
          <span className="beta">BETA</span>
        </div>
        <div className="editor-heading">
          <span className="eyebrow">SEU NOVO CARTÃO DE VISITA</span>
          <h1>
            Assinatura com
            <br />
            <em>a sua identidade.</em>
          </h1>
          <p>Crie uma assinatura profissional em poucos minutos.</p>
        </div>
        <div className="steps">
          {titles.map((title, i) => (
            <Button
              variant="ghost"
              key={title}
              className={`step ${step === i ? "active" : ""} ${step > i ? "done" : ""}`}
              onClick={() => setStep(i)}
            >
              <span className="step-number">
                {step > i ? <Check size={14} /> : `0${i + 1}`}
              </span>
              <span>{title}</span>
              {i < 3 && <span className="step-line" />}
            </Button>
          ))}
        </div>
        <section className="form-area">
          {step === 0 && (
            <>
              <div className="section-title">
                <div className="section-icon">
                  <UserRound size={16} />
                </div>
                <div>
                  <h2>Vamos começar por você</h2>
                  <p>Seus dados aparecem na assinatura.</p>
                </div>
              </div>
              <div className="form-grid two">
                {input("firstName", "Nome", true, "Ex.: Ana")}
                {input("lastName", "Sobrenome", true, "Ex.: Souza")}
              </div>
              <div className="form-grid two">
                {input("role", "Cargo", false, "Ex.: Diretora de criação")}
                {input("department", "Departamento", false, "Ex.: Marketing")}
              </div>
              {input("company", "Empresa", false, "Ex.: Estúdio Criativo")}
              <div className="subsection">
                <span className="subsection-title">CONTATO</span>
                <div className="form-grid two">
                  {input(
                    "phone",
                    "Telefone comercial",
                    false,
                    "(11) 3333-0000",
                    "tel"
                  )}
                  {input("mobile", "Celular", false, "(11) 99999-0000", "tel")}
                </div>
                <div className="form-grid two">
                  {input("email", "E-mail", false, "ana@empresa.com", "email")}
                  {input(
                    "secondaryEmail",
                    "E-mail secundário",
                    false,
                    "contato@empresa.com",
                    "email"
                  )}
                </div>
                <div className="form-grid two">
                  {input("website", "Site", false, "www.empresa.com", "url")}
                  {input("address", "Endereço", false, "Cidade, estado")}
                </div>
              </div>
              <div className="subsection">
                <span className="subsection-title">AVISO LEGAL / LGPD</span>
                <label className="legal-notice-field">
                  <span>Texto do aviso</span>
                  <textarea
                    value={fields.legalNotice}
                    onChange={(event) =>
                      update("legalNotice", event.target.value)
                    }
                    placeholder={"**Aviso de confidencialidade**\nDigite o texto da sua empresa..."}
                    rows={4}
                  />
                  <small>
                    Markdown: **negrito**, *itálico*, listas e [links](https://...)
                  </small>
                </label>
              </div>
              <div className="subsection">
                <span className="subsection-title">
                  REDES SOCIAIS <span>OPCIONAL</span>
                </span>
                <div className="social-inputs">
                  {socialInputs.map(([key, label]) => (
                    <label className="social-input" key={key}>
                      <span className="social-input-icon">
                        {socialGlyph(label)}
                      </span>
                      <Input
                        className="social-text-input"
                        aria-label={label}
                        placeholder={
                          key === "whatsapp"
                            ? "+55 (11) 99999-9999"
                            : label === "X"
                              ? "Perfil X"
                              : label
                        }
                        type={key === "whatsapp" ? "tel" : "text"}
                        value={fields[key]}
                        onChange={(e) =>
                          update(
                            key,
                            key === "whatsapp"
                              ? formatWhatsAppPhone(e.target.value)
                              : e.target.value
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="section-title">
                <div className="section-icon">
                  <ImagePlus size={16} />
                </div>
                <div>
                  <h2>Uma marca que representa você</h2>
                  <p>Adicione a logo da sua empresa.</p>
                </div>
              </div>
              <Button
                variant="outline"
                className={`upload-zone ${logo ? "has-image" : ""}`}
                onClick={() => fileRef.current?.click()}
              >
                {logo ? (
                  <>
                    <img src={logo} alt="Prévia da logo" />
                    <span>Trocar imagem</span>
                  </>
                ) : (
                  <>
                    <span className="upload-icon">
                      <ImagePlus size={21} />
                    </span>
                    <strong>
                      Arraste uma imagem ou <b>escolha um arquivo</b>
                    </strong>
                    <small>PNG, JPG ou SVG · até 5 MB</small>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && file.size <= 5 * 1024 * 1024) {
                      const reader = new FileReader()
                      reader.onload = () => setLogo(String(reader.result))
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </Button>
              {logo && (
                <Button
                  variant="ghost"
                  className="remove-logo"
                  onClick={() => setLogo("")}
                >
                  <Trash2 size={14} /> Remover logo
                </Button>
              )}
              <div className="tip-card">
                <span>?</span>
                <p>
                  <strong>Dica de design</strong>
                  <br />
                  Logos com fundo transparente ficam ótimas em assinaturas de
                  e-mail.
                </p>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="section-title">
                <div className="section-icon">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2>Seu estilo, suas regras</h2>
                  <p>Personalize os detalhes da assinatura.</p>
                </div>
              </div>

              <ColorPicker
                label="Cor do nome"
                value={style.nameColor}
                onChange={(nameColor) =>
                  setStyle((prev) => ({ ...prev, nameColor }))
                }
              />
              <ColorPicker
                label="Cor dos divisores"
                value={style.divider}
                onChange={(divider) =>
                  setStyle((prev) => ({ ...prev, divider }))
                }
              />
              <ColorPicker
                label="Cor do aviso legal/LGPD"
                value={style.legalColor}
                onChange={(legalColor) =>
                  setStyle((prev) => ({ ...prev, legalColor }))
                }
              />
              <div className="select-label">
                <span>TIPOGRAFIA</span>
                <Select
                  value={style.font}
                  onValueChange={(font) =>
                    font && setStyle((prev) => ({ ...prev, font }))
                  }
                >
                  <SelectTrigger className="font-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="style-control size-control">
                <label>
                  Tamanho do texto <strong>{style.size}px</strong>
                </label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  value={style.size}
                  onChange={(e) =>
                    setStyle({ ...style, size: Number(e.target.value) })
                  }
                />
                <div>
                  <span>Pequeno</span>
                  <span>Grande</span>
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="section-title">
                <div className="section-icon">
                  <Link2 size={16} />
                </div>
                <div>
                  <h2>Escolha seu modelo</h2>
                  <p>Um bom começo para a sua assinatura.</p>
                </div>
              </div>
              <div className="template-list">
                {["Clássico", "Centralizado", "Invertido"].map(
                  (name, i) => (
                    <Button
                      variant="outline"
                      key={name}
                      onClick={() => setTemplate(i)}
                      className={`template-option ${template === i ? "selected" : ""}`}
                    >
                      <div className={`mini-signature mini-${i}`}>
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="template-name">{name}</span>
                      <span className="radio-dot">
                        {template === i && <i />}
                      </span>
                    </Button>
                  )
                )}
              </div>
            </>
          )}
          {error && (
            <div className="error-message">
              Preencha nome e sobrenome para copiar a assinatura.
            </div>
          )}
        </section>
        <footer className="editor-footer">
          <Button variant="ghost" className="clear-button" onClick={clean}>
            <Trash2 size={15} /> Limpar tudo
          </Button>
          <div>
            <Button
              variant="outline"
              className="nav-button back"
              disabled={step === 0}
              onClick={() => setStep(Math.max(0, step - 1))}
            >
              <ChevronLeft size={16} /> Voltar
            </Button>
            <Button
              className="nav-button next"
              onClick={() => {
                if (step === 0 && !fieldsComplete) {
                  setError(true)
                  return
                }
                setError(false)
                setStep(Math.min(3, step + 1))
              }}
            >
              {step === 3 ? "Pronto" : "Continuar"}
              <ChevronRight size={16} />
            </Button>
          </div>
        </footer>
      </aside>
      <section className="preview-panel">
        <header className="preview-header">
          <div>
            <div className="eyebrow">AO VIVO</div>
            <h2>Prévia da assinatura</h2>
          </div>
          <div className="live-indicator">
            <i /> Atualizado em tempo real
          </div>
        </header>
        <div className="preview-workspace">
          <div className="preview-label">
            <span>PRÉ-VISUALIZAÇÃO</span>
            <span className="desktop-label">GMAIL · DESKTOP</span>
          </div>
          <div className="email-card">
            <div className="email-top">
              <div className="avatar">
                {fields.firstName ? fields.firstName[0].toUpperCase() : "A"}
                {fields.lastName ? fields.lastName[0].toUpperCase() : "S"}
              </div>
              <div>
                <div className="email-sender">
                  {fullName || "Seu nome"}{" "}
                  <span>&lt;{fields.email || "seuemail@empresa.com"}&gt;</span>
                </div>
                <div className="email-recipient">
                  para mim <ChevronDown size={12} />
                </div>
              </div>
              <span className="email-time">agora</span>
            </div>
            <div className="email-body">
              <p>
                Olá!
                <br />
                <br />
                Segue meu contato. Fico à disposição.
                <br />
                <br />
                Abraços,
              </p>
              <div
                className="signature-box"
                dangerouslySetInnerHTML={{ __html: makeHtml("") }}
              />
              <div className="email-signoff">
                —<br />
                Enviado do Gmail
              </div>
            </div>
          </div>
          <div className="preview-hint">
            <span>✳</span> Seu preview muda automaticamente enquanto você edita.
          </div>
        </div>
        <footer className="preview-footer">
          <div>
            <span className="secure-dot" /> Sua assinatura fica salva apenas
            neste dispositivo.
          </div>
          <Button
            className={`copy-button ${copied ? "copied" : ""}`}
            onClick={copy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
            {copied ? "Copiado!" : "Copiar assinatura"}
          </Button>
        </footer>
      </section>
    </main>
  )
}
