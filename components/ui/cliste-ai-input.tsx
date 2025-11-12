"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback, memo, useMemo } from "react";
import { Plus } from "lucide-react";

// ===== TYPES =====

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

// ===== CONTEXT =====

interface ChatInputContextProps {
  mousePosition: Position;
  ripples: RippleEffect[];
  addRipple: (x: number, y: number) => void;
  animationDuration: number;
  glowIntensity: number;
  textColor: string;
  showEffects: boolean;
}

const ChatInputContext = createContext<ChatInputContextProps | undefined>(undefined);

function useChatInputContext() {
  const context = useContext(ChatInputContext);
  if (context === undefined) {
    throw new Error("useChatInputContext must be used within a ChatInputProvider");
  }
  return context;
}

// ===== COMPONENTS =====

const SendButton = memo(({ 
  isDisabled,
  textColor
}: SendButtonProps) => {
  return (
    <button
      type="submit"
      aria-label="Send message"
      disabled={isDisabled}
      className={`ml-auto self-center h-9 w-9 flex items-center justify-center rounded-full border-0 p-0 transition-all z-20 cursor-pointer ${
        isDisabled
          ? 'opacity-30 cursor-not-allowed bg-neutral-700/50 text-neutral-500'
          : 'opacity-100 bg-white text-black hover:bg-neutral-100 hover:scale-105'
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <path
          d="M16 22L16 10M16 10L11 15M16 10L21 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
});

SendButton.displayName = "SendButton";

const OptionsMenu = memo(({ 
  isOpen, 
  onSelect,
  textColor,
  menuOptions 
}: OptionsMenuProps) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-30 min-w-[120px]">
      <ul className="py-1">
        {menuOptions.map((option) => (
          <li
            key={option}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium"
            style={{ color: textColor }}
            onClick={() => onSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
});

OptionsMenu.displayName = "OptionsMenu";

const OptionTag = memo(({ 
  option, 
  onRemove,
  textColor 
}: OptionTagProps) => (
  <div
    className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs"
    style={{ color: textColor }}
  >
    <span>{option}</span>
    <button
      type="button"
      onClick={() => onRemove(option)}
      className="h-4 w-4 flex items-center justify-center rounded-full hover:bg-white/20 cursor-pointer"
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
));

OptionTag.displayName = "OptionTag";

const GlowEffects = memo(({ 
  glowIntensity, 
  mousePosition,
  animationDuration,
  enabled
}: GlowEffectsProps) => {
  if (!enabled) return null;
  
  return (
    <>
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 20px rgba(147, 51, 234, ${0.15 * glowIntensity}),
            inset 0 0 40px rgba(236, 72, 153, ${0.1 * glowIntensity})
          `,
        }}
      ></div>
      
      {/* Outer glow on focus */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `
            0 0 20px rgba(147, 51, 234, ${0.3 * glowIntensity}),
            0 0 40px rgba(236, 72, 153, ${0.2 * glowIntensity}),
            0 0 60px rgba(59, 130, 246, ${0.15 * glowIntensity})
          `,
          filter: 'blur(2px)',
        }}
      ></div>
      
      {/* Mouse follow gradient */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}% ${mousePosition.y}%, rgba(147,51,234,0.1) 0%, rgba(236,72,153,0.05) 40%, transparent 70%)`,
        }}
      ></div>
    </>
  );
});

GlowEffects.displayName = "GlowEffects";

const RippleEffects = memo(({ ripples, enabled }: RippleEffectsProps) => {
  if (!enabled || ripples.length === 0) return null;
  
  return (
    <>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none blur-sm"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400/15 via-pink-400/10 to-blue-400/15 animate-ping"></div>
        </div>
      ))}
    </>
  );
});

RippleEffects.displayName = "RippleEffects";

const InputArea = memo(({ 
  value,
  setValue,
  placeholder,
  handleKeyDown,
  disabled,
  isSubmitDisabled,
  textColor
}: InputAreaProps) => {
  return (
    <div className="flex-1 relative h-full flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Message Input"
        className="w-full h-9 bg-transparent text-[15px] font-normal text-left self-center placeholder-neutral-500 border-0 outline-none px-1 pr-12 z-20 relative text-white"
        disabled={disabled}
      />
      <SendButton isDisabled={isSubmitDisabled} textColor={textColor} />
    </div>
  );
});

InputArea.displayName = "InputArea";

const MenuButton = memo(({ 
  toggleMenu,
  menuRef,
  isMenuOpen,
  onSelectOption,
  textColor,
  menuOptions
}: MenuButtonProps) => (
  <div className="relative" ref={menuRef}>
    <button
      type="button"
      onClick={toggleMenu}
      aria-label="Menu options"
      className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 transition-all ml-1 mr-2 cursor-pointer text-neutral-400 hover:text-white"
    >
      <Plus size={18} />
    </button>
    <OptionsMenu 
      isOpen={isMenuOpen} 
      onSelect={onSelectOption} 
      textColor={textColor}
      menuOptions={menuOptions}
    />
  </div>
));

MenuButton.displayName = "MenuButton";

const SelectedOptions = memo(({ 
  options,
  onRemove,
  textColor
}: SelectedOptionsProps) => {
  if (options.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2 pl-3 pr-3 z-20 relative">
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
});

SelectedOptions.displayName = "SelectedOptions";

export default function ClisteAIInput({
  placeholder = "Ask about your business performance...",
  onSubmit = (value: string) => console.log("Submitted:", value),
  disabled = false,
  glowIntensity = 0.4,
  expandOnFocus = true,
  animationDuration = 500,
  textColor = "#FFFFFF",
  backgroundOpacity = 0.15,
  showEffects = true,
  menuOptions = ["Auto", "Max", "Search", "Plan"] as MenuOption[]
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 50, y: 50 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const throttleRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && onSubmit && !disabled) {
        onSubmit(value.trim());
        setValue("");
      }
    },
    [value, onSubmit, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!showEffects) return;
    
    if (containerRef.current && !throttleRef.current) {
      throttleRef.current = window.setTimeout(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setMousePosition({ x, y });
        }
        throttleRef.current = null;
      }, 50);
    }
  }, [showEffects]);

  const addRipple = useCallback((x: number, y: number) => {
    if (!showEffects) return;
    
    if (ripples.length < 5) {
      const newRipple: RippleEffect = {
        x,
        y,
        id: Date.now(),
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
  }, [ripples, showEffects]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      addRipple(x, y);
    }
  }, [addRipple]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const selectOption = useCallback((option: MenuOption) => {
    setSelectedOptions(prev => {
      if (!prev.includes(option)) {
        return [...prev, option];
      }
      return prev;
    });
    setIsMenuOpen(false);
  }, []);

  const removeOption = useCallback((option: MenuOption) => {
    setSelectedOptions(prev => prev.filter(opt => opt !== option));
  }, []);

  const contextValue = useMemo(() => ({
    mousePosition,
    ripples,
    addRipple,
    animationDuration,
    glowIntensity,
    textColor,
    showEffects
  }), [mousePosition, ripples, addRipple, animationDuration, glowIntensity, textColor, showEffects]);

  const isSubmitDisabled = disabled || !value.trim();

  const hasModeSelected = selectedOptions.length > 0;
  const shouldExpandOnFocus = expandOnFocus && !hasModeSelected;
  const baseWidthClass = hasModeSelected ? "w-[500px]" : "w-[320px]";
  const focusWidthClass = shouldExpandOnFocus ? "focus-within:w-[500px]" : "";

  return (
    <ChatInputContext.Provider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        className={`sticky bottom-8 left-1/2 -translate-x-1/2 z-50 mx-auto min-h-12 ${baseWidthClass} transition-all ease-out ${focusWidthClass} translate-y-0 opacity-100`}
        style={{
          transition: `transform ${animationDuration}ms, opacity 200ms, left 200ms, width ${animationDuration}ms`,
        }}
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="relative flex flex-col w-full min-h-full bg-[#1a1a1a]/90 backdrop-blur-xl shadow-2xl rounded-[28px] p-2 overflow-visible group transition-all border border-neutral-800/50 hover:border-purple-500/30"
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            transition: `all ${animationDuration}ms ease, box-shadow ${animationDuration}ms ease`,
          }}
        >
          <GlowEffects 
            glowIntensity={glowIntensity} 
            mousePosition={mousePosition} 
            animationDuration={animationDuration}
            enabled={showEffects}
          />
          
          <RippleEffects ripples={ripples} enabled={showEffects} />
          
          <div className="flex items-center relative z-20">
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

