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
  mobile: string
  address: string
  linkedin: string
  facebook: string
  instagram: string
  lattes: string
  x: string
  whatsapp: string
}
type Style = {
  divider: string
  icon: string
  font: string
  text: string
  size: number
}
const initial: Fields = {
  firstName: "",
  lastName: "",
  role: "",
  department: "",
  company: "",
  phone: "",
  email: "",
  mobile: "",
  address: "",
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
  phone: "/icons/phone.png",
  mobile: "/icons/smartphone.png",
  address: "/icons/pin.png",
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
    icon: "#087e72",
    font: "Arial",
    text: "#233634",
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
        fields.phone && ["phone", fields.phone],
        fields.mobile && ["mobile", fields.mobile],
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
      icon: "#087e72",
      font: "Arial",
      text: "#233634",
      size: 14,
    })
    setTemplate(0)
    setStep(0)
    setError(false)
    setCopied(false)
  }
  const makeHtml = () => {
    const name = fullName || "Seu nome aqui"
    const details = [
      [fields.role, fields.department].filter(Boolean).join(" · "),
      fields.company,
    ]
      .filter(Boolean)
      .map(
        (line) =>
          `<div style="margin-top:5px;color:${style.text}">${line}</div>`
      )
      .join("")
    const rows = contact
      .map(
        ([kind, value]) =>
          `<span style="display:inline-block;vertical-align:middle;margin:0 14px 4px 0;white-space:nowrap"><img src="${publicAssetBase}${contactIconPaths[kind]}" width="14" height="14" alt="" style="display:inline-block;width:14px;height:14px;margin-right:5px;border:0;vertical-align:middle"><span style="color:${style.text};vertical-align:middle">${kind === "email" ? `<a href="mailto:${value}" style="color:${style.text};text-decoration:none">${value}</a>` : value}</span></span>`
      )
      .join("")
    const picture = logo
      ? `<img src="${logo}" width="90" style="width:90px;max-height:90px;object-fit:contain" alt="Logo">`
      : ""
    const assetBase = publicAssetBase
    const network = socials
      .map(
        ([, label, url]) => {
          const iconPath = socialIconPath(label)
          const icon = iconPath
            ? `<img src="${assetBase}${iconPath}" width="15" height="15" alt="${label}" style="display:inline-block;width:15px;height:15px;border:0;vertical-align:middle">`
            : socialMark(label)
          return `<a href="${socialHref(url, label)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" style="display:inline-block;box-sizing:border-box;width:24px;height:24px;line-height:22px;text-align:center;vertical-align:middle;margin:8px 5px 0 0;color:#111;background:#fff;border:1px solid #ddd;border-radius:4px;text-decoration:none;font-family:Arial,sans-serif;font-size:10px;font-weight:bold">${icon}</a>`
        }
      )
      .join("")
    const profile = `<div style="font-family:${style.font},Arial,sans-serif;font-size:${style.size}px;color:${style.text};line-height:1.45">${template === 1 ? `<div style="text-align:center">${picture}<div style="font-size:${style.size * 1.15}px;font-weight:bold;color:${style.icon};margin-top:8px">${name}</div>${details}<div style="border-top:2px solid ${style.divider};margin-top:13px;padding-top:9px;display:inline-block;text-align:left">${rows}</div><div>${network}</div></div>` : `<table cellpadding="0" cellspacing="0" style="font:inherit;border-collapse:collapse"><tr>${template === 3 ? `<td style="padding:0 20px 0 0;border-right:2px solid ${style.divider}"><div style="font-size:${style.size * 1.15}px;font-weight:bold;color:${style.icon}">${name}</div>${details}</td><td style="padding-left:18px">${picture}${rows}<div>${network}</div></td>` : `<td style="vertical-align:top;padding:2px 17px 2px 0">${picture}${template === 2 && socials.length ? `<div>${network}</div>` : ""}</td><td style="vertical-align:top;padding-left:17px;border-left:${template === 2 ? "0" : `2px solid ${style.divider}`}"><div style="font-size:${style.size * 1.15}px;font-weight:bold;color:${style.icon}">${name}</div>${details}<div style="${template === 2 ? `border-top:2px solid ${style.divider};padding-top:8px;margin-top:8px` : "margin-top:9px"}">${rows}</div>${template === 2 && socials.length ? "" : `<div>${network}</div>`}</td>`}</tr></table>`}</div>`
    return profile
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
              `${fullName}${fields.role ? ` | ${fields.role}` : ""}\n${contact.map((x) => x[1]).join(" | ")}`,
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
                  {input("address", "Endereço", false, "Cidade, estado")}
                </div>
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
                label="Cor da fonte"
                value={style.text}
                onChange={(text) => setStyle((prev) => ({ ...prev, text }))}
              />
              <ColorPicker
                label="Cor dos ícones e destaques"
                value={style.icon}
                onChange={(icon) => setStyle((prev) => ({ ...prev, icon }))}
              />
              <ColorPicker
                label="Cor dos divisores"
                value={style.divider}
                onChange={(divider) =>
                  setStyle((prev) => ({ ...prev, divider }))
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
                {["Clássico", "Centralizado", "Compacto", "Executivo"].map(
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
                style={{
                  fontFamily:
                    style.font === "Roboto"
                      ? "var(--font-heading), Arial, sans-serif"
                      : style.font === "Manrope"
                        ? "var(--font-sans), Arial, sans-serif"
                        : `${style.font}, Arial, sans-serif`,
                  fontSize: `${style.size}px`,
                  color: style.text,
                }}
              >
                <div className={`signature-layout layout-${template}`}>
                  {template === 1 ? (
                    <div className="sig-center">
                      {logo && (
                        <img className="sig-logo" src={logo} alt="Logo" />
                      )}
                      <div
                        className="sig-name"
                        style={{ fontSize: `${style.size * 1.15}px` }}
                      >
                        {fullName || "Seu nome Sobrenome"}
                      </div>
                      {(fields.role || fields.department) && (
                        <div
                          className="sig-role"
                          style={{ fontSize: `${style.size * 0.82}px` }}
                        >
                          {[fields.role, fields.department]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      )}
                      {fields.company && (
                        <div
                          className="sig-company"
                          style={{ fontSize: `${style.size * 0.82}px` }}
                        >
                          {fields.company}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="sig-brand">
                        {logo ? (
                          <img className="sig-logo" src={logo} alt="Logo" />
                        ) : (
                          <div className="logo-placeholder">
                            <ImagePlus size={16} />
                            <span>SUA LOGO</span>
                          </div>
                        )}
                        {template === 2 && (
                          <div className="social-row">
                            {socials.map(([, label, url]) => (
                              <a
                                key={label}
                                href={socialHref(url, label)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={label}
                                aria-label={label}
                                style={{
                                  color: style.icon,
                                  borderColor: style.divider,
                                  backgroundColor: "#fff",
                                  borderRadius: 4,
                                }}
                              >
                                {socialGlyph(label)}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        className="sig-content"
                        style={
                          template !== 2
                            ? { borderLeftColor: style.divider }
                            : undefined
                        }
                      >
                        <div
                          className="sig-name"
                          style={{
                            color: style.icon,
                            fontSize: `${style.size * 1.15}px`,
                          }}
                        >
                          {fullName || "Seu nome Sobrenome"}
                        </div>
                        {(fields.role || fields.department) && (
                          <div
                            className="sig-role"
                            style={{ fontSize: `${style.size * 0.82}px` }}
                          >
                            {[fields.role, fields.department]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
                        {fields.company && (
                          <div
                            className="sig-company"
                            style={{ fontSize: `${style.size * 0.82}px` }}
                          >
                            {fields.company}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {template === 1 && (
                  <div
                    className="sig-divider"
                    style={{ background: style.divider }}
                  />
                )}
                <div
                  className={`sig-contact ${template === 1 ? "center-contact" : ""}`}
                >
                  {contact.map(([kind, value]) => (
                    <div className="contact-item" key={kind}>
                      <img
                        className="provided-contact-icon"
                        src={contactIconPaths[kind]}
                        alt=""
                        aria-hidden="true"
                      />
                      {kind === "email" ? (
                        <a
                          href={`mailto:${value}`}
                          style={{ color: style.text }}
                        >
                          {value}
                        </a>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
                {!(template === 2) && (
                  <div className="social-row">
                    {socials.map(([, label, url]) => (
                      <a
                        key={label}
                        href={socialHref(url, label)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label}
                        aria-label={label}
                        style={{
                          color: style.icon,
                          borderColor: style.divider,
                          backgroundColor: "#fff",
                          borderRadius: 4,
                        }}
                      >
                        {socialGlyph(label)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
