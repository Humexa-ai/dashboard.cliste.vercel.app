"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { Plus } from "lucide-react";

type MenuOption = "Auto" | "Max" | "Search" | "Plan";

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface Position {
  x: number;
  y: number;
}

interface ChatInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  glowIntensity?: number;
  expandOnFocus?: boolean;
  animationDuration?: number;
  textColor?: string;
  backgroundOpacity?: number;
  showEffects?: boolean;
  menuOptions?: MenuOption[];
  className?: string;
}

interface InputAreaProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  isSubmitDisabled: boolean;
  textColor: string;
}

interface GlowEffectsProps {
  glowIntensity: number;
  mousePosition: Position;
  animationDuration: number;
  enabled: boolean;
}

interface RippleEffectsProps {
  ripples: RippleEffect[];
  enabled: boolean;
}

interface MenuButtonProps {
  toggleMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  isMenuOpen: boolean;
  onSelectOption: (option: MenuOption) => void;
  textColor: string;
  menuOptions: MenuOption[];
}

interface SelectedOptionsProps {
  options: MenuOption[];
  onRemove: (option: MenuOption) => void;
  textColor: string;
}

interface SendButtonProps {
  isDisabled: boolean;
  textColor: string;
}

interface OptionsMenuProps {
  isOpen: boolean;
  onSelect: (option: MenuOption) => void;
  textColor: string;
  menuOptions: MenuOption[];
}

interface OptionTagProps {
  option: MenuOption;
  onRemove: (option: MenuOption) => void;
  textColor: string;
}

interface ChatInputContextProps {
  mousePosition: Position;
  ripples: RippleEffect[];
  addRipple: (x: number, y: number) => void;
  animationDuration: number;
  glowIntensity: number;
  textColor: string;
  showEffects: boolean;
}

const ChatInputContext = createContext<ChatInputContextProps | undefined>(
  undefined,
);

function useChatInputContext() {
  const context = useContext(ChatInputContext);
  if (!context) {
    throw new Error(
      "useChatInputContext must be used within a ChatInputContext.Provider",
    );
  }
  return context;
}

const SendButton = memo(({ isDisabled, textColor }: SendButtonProps) => {
  return (
    <button
      type="submit"
      aria-label="Send message"
      disabled={isDisabled}
      className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/8 transition-all ${
        isDisabled
          ? "cursor-not-allowed bg-white/5 text-zinc-400/60"
          : "bg-gradient-to-br from-white/10 via-white/15 to-white/10 text-zinc-100 hover:text-white hover:from-white/15 hover:via-white/20 hover:to-white/15"
      }`}
      style={{ color: textColor }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`block ${isDisabled ? "opacity-40" : "opacity-100"}`}
      >
        <path
          d="M16 22L16 10M16 10L11 15M16 10L21 15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
});
SendButton.displayName = "SendButton";

const OptionsMenu = memo(
  ({ isOpen, onSelect, textColor, menuOptions }: OptionsMenuProps) => {
    if (!isOpen) return null;
    return (
      <div className="absolute left-0 top-full z-30 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-white/10 bg-[#0D1017]/95 shadow-xl backdrop-blur">
        <ul className="py-1">
          {menuOptions.map((option) => (
            <li
              key={option}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
              style={{ color: textColor, fontFamily: '"Inter", sans-serif' }}
              onClick={() => onSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
OptionsMenu.displayName = "OptionsMenu";

const OptionTag = memo(
  ({ option, onRemove, textColor }: OptionTagProps) => (
    <div
      className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-200 shadow-sm"
      style={{ fontFamily: '"Inter", sans-serif', color: textColor }}
    >
      <span>{option}</span>
      <button
        type="button"
        onClick={() => onRemove(option)}
        className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-white/20"
        style={{ color: textColor }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  ),
);
OptionTag.displayName = "OptionTag";

const GlowEffects = memo(
  ({ glowIntensity, mousePosition, animationDuration, enabled }: GlowEffectsProps) => {
    if (!enabled) return null;
    return (
      <>
        <div className="absolute inset-0 rounded-full opacity-10 blur-xl transition-opacity duration-500 group-hover:opacity-35" />
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-70 group-focus-within:opacity-70"
          style={{
            boxShadow: `0 0 45px rgba(148,163,184,${0.25 * glowIntensity})`,
            background: `radial-gradient(circle 120px at ${mousePosition.x}% ${mousePosition.y}%, rgba(148,163,184,0.3) 0%, rgba(113,128,150,0.25) 45%, rgba(71,85,105,0.2) 75%, transparent 100%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-40">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
          />
        </div>
      </>
    );
  },
);
GlowEffects.displayName = "GlowEffects";

const RippleEffects = memo(({ ripples, enabled }: RippleEffectsProps) => {
  if (!enabled || ripples.length === 0) return null;
  return (
    <>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 blur-sm"
          style={{ left: ripple.x, top: ripple.y }}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-zinc-300/30 via-zinc-500/20 to-zinc-700/25 opacity-80 blur-[1px] animate-ping" />
        </div>
      ))}
    </>
  );
});
RippleEffects.displayName = "RippleEffects";

const InputArea = memo(
  ({
    value,
    setValue,
    placeholder,
    handleKeyDown,
    disabled,
    isSubmitDisabled,
    textColor,
  }: InputAreaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 22;
      const maxHeight = lineHeight * 4 + 18;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }, [value]);

    return (
      <div className="relative flex h-full flex-1 items-center">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Message input"
          rows={1}
          className="h-8 w-full resize-none bg-transparent px-3 text-left text-sm font-normal text-white/85 outline-none placeholder:text-white/35"
          style={{
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "-0.14px",
            lineHeight: "22px",
            color: textColor,
          }}
          disabled={disabled}
          onFocus={(e) => e.target.classList.add("outline-none")}
        />
        <SendButton isDisabled={isSubmitDisabled} textColor={textColor} />
      </div>
    );
  },
);
InputArea.displayName = "InputArea";

const MenuButton = memo(
  ({
    toggleMenu,
    menuRef,
    isMenuOpen,
    onSelectOption,
    textColor,
    menuOptions,
  }: MenuButtonProps) => (
    <div className="relative mr-1.5" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Menu options"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900/70 text-zinc-300 transition-colors hover:text-white"
        style={{ color: textColor }}
      >
        <Plus size={16} />
      </button>
      <OptionsMenu
        isOpen={isMenuOpen}
        onSelect={onSelectOption}
        textColor={textColor}
        menuOptions={menuOptions}
      />
    </div>
  ),
);
MenuButton.displayName = "MenuButton";

const SelectedOptions = memo(
  ({ options, onRemove, textColor }: SelectedOptionsProps) => {
    if (options.length === 0) return null;
    return (
      <div className="relative z-20 mt-2 flex flex-wrap gap-2 px-4">
        {options.map((option) => (
          <OptionTag
            key={option}
            option={option}
            onRemove={onRemove}
            textColor={textColor}
          />
        ))}
      </div>
    );
  },
);
SelectedOptions.displayName = "SelectedOptions";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function PromptInputDynamicGrow({
  placeholder = "Ask ClisteAi",
  onSubmit = (value: string) => console.log("Submitted:", value),
  disabled = false,
  glowIntensity = 0.55,
  expandOnFocus = true,
  animationDuration = 500,
  textColor = "#E5E7EB",
  backgroundOpacity = 0.16,
  showEffects = true,
  menuOptions = ["Auto", "Max", "Search", "Plan"],
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [mousePosition, setMousePosition] = useState<Position>({
    x: 50,
    y: 50,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (value.trim() && onSubmit && !disabled) {
        onSubmit(value.trim());
        setValue("");
      }
    },
    [value, onSubmit, disabled],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit(event as unknown as React.FormEvent);
      }
    },
    [handleSubmit],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!showEffects) return;
      if (containerRef.current && !throttleRef.current) {
        throttleRef.current = window.setTimeout(() => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const x = clamp(
              ((event.clientX - rect.left) / rect.width) * 100,
              0,
              100,
            );
            const y = clamp(
              ((event.clientY - rect.top) / rect.height) * 100,
              0,
              100,
            );
            setMousePosition({ x, y });
          }
          throttleRef.current = null;
        }, 50);
      }
    },
    [showEffects],
  );

  const addRipple = useCallback(
    (x: number, y: number) => {
      if (!showEffects) return;
      if (ripples.length < 6) {
        const newRipple: RippleEffect = { x, y, id: Date.now() };
        setRipples((prev) => [...prev, newRipple]);
        window.setTimeout(() => {
          setRipples((prev) =>
            prev.filter((ripple) => ripple.id !== newRipple.id),
          );
        }, 600);
      }
    },
    [ripples.length, showEffects],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        addRipple(event.clientX - rect.left, event.clientY - rect.top);
      }
    },
    [addRipple],
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const selectOption = useCallback((option: MenuOption) => {
    setSelectedOptions((prev) => {
      if (!prev.includes(option)) {
        return [...prev, option];
      }
      return prev;
    });
    setIsMenuOpen(false);
  }, []);

  const removeOption = useCallback((option: MenuOption) => {
    setSelectedOptions((prev) => prev.filter((opt) => opt !== option));
  }, []);

  const contextValue = useMemo(
    () => ({
      mousePosition,
      ripples,
      addRipple,
      animationDuration,
      glowIntensity,
      textColor,
      showEffects,
    }),
    [
      mousePosition,
      ripples,
      addRipple,
      animationDuration,
      glowIntensity,
      textColor,
      showEffects,
    ],
  );

  const isSubmitDisabled = disabled || !value.trim();
  const hasModeSelected = selectedOptions.length > 0;
  const shouldExpandOnFocus = expandOnFocus && !hasModeSelected;
  const baseWidth = hasModeSelected ? "w-[24rem]" : "w-[19rem]";
  const focusWidth = shouldExpandOnFocus ? "focus-within:w-[24rem]" : "";
  const clampedBackgroundOpacity = clamp(backgroundOpacity, 0.1, 0.5);
  const backgroundColor = `rgba(17, 24, 39, ${clampedBackgroundOpacity})`;

  return (
    <ChatInputContext.Provider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        className={`sticky bottom-16 left-1/2 -translate-x-1/2 translate-y-0 opacity-100 transition-all ease-out ${baseWidth} ${focusWidth} ${className ?? ""}`}
        style={{
          transitionDuration: `${animationDuration}ms`,
        }}
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="group relative flex min-h-full w-full flex-col overflow-visible rounded-full p-[3px]"
          style={{
            transition: `all ${animationDuration}ms ease`,
          }}
        >
          <GlowEffects
            glowIntensity={glowIntensity}
            mousePosition={mousePosition}
            animationDuration={animationDuration}
            enabled={showEffects}
          />
          <RippleEffects ripples={ripples} enabled={showEffects} />
          <div
            className="relative z-20 flex items-center rounded-full border border-white/12 bg-[#0b111d]/85 px-2.5 py-1 shadow-[0_18px_90px_-40px_rgba(148,163,184,0.6)] backdrop-blur-2xl"
            style={{ backgroundColor }}
          >
            <MenuButton
              toggleMenu={toggleMenu}
              menuRef={menuRef}
              isMenuOpen={isMenuOpen}
              onSelectOption={selectOption}
              textColor={textColor}
              menuOptions={menuOptions}
            />
            <InputArea
              value={value}
              setValue={setValue}
              placeholder={placeholder}
              handleKeyDown={handleKeyDown}
              disabled={disabled}
              isSubmitDisabled={isSubmitDisabled}
              textColor={textColor}
            />
          </div>
          <SelectedOptions
            options={selectedOptions}
            onRemove={removeOption}
            textColor={textColor}
          />
        </div>
      </form>
    </ChatInputContext.Provider>
  );
}
