// MenuIcons.js - Component chứa tất cả các icon SVG
import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

export const MenuIcons = {
  checklist: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="12" y="8" width="40" height="48" rx="4" fill="#3b82f6" opacity="0.1"/>
      <Rect x="12" y="8" width="40" height="48" rx="4" stroke="#3b82f6" strokeWidth="2" fill="none"/>
      <Path d="M20 20H44" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="20" cy="30" r="2" fill="#3b82f6"/>
      <Path d="M26 30H44" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="20" cy="38" r="2" fill="#3b82f6"/>
      <Path d="M26 38H44" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="20" cy="46" r="2" fill="#3b82f6"/>
      <Path d="M26 46H44" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  recheck: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="12" y="8" width="40" height="48" rx="4" fill="#10b981" opacity="0.1"/>
      <Rect x="12" y="8" width="40" height="48" rx="4" stroke="#10b981" strokeWidth="2" fill="none"/>
      <Path d="M20 20H44" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M18 30L22 34L28 28" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M32 30H44" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M18 42L22 46L28 40" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M32 42H44" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M48 52C50 50 52 48 52 45C52 42 50 40 48 38" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M48 52L50 50L52 52" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  incident: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Circle cx="32" cy="32" r="20" fill="#ef4444" opacity="0.1"/>
      <Circle cx="32" cy="32" r="20" stroke="#ef4444" strokeWidth="2" fill="none"/>
      <Path d="M32 22V36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
      <Circle cx="32" cy="42" r="2" fill="#ef4444"/>
      <Path d="M28 12L24 8M36 12L40 8M12 28L8 24M12 36L8 40M52 28L56 24M52 36L56 40" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  lookup: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Circle cx="28" cy="28" r="16" fill="#8b5cf6" opacity="0.1"/>
      <Circle cx="28" cy="28" r="16" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
      <Path d="M40 40L52 52" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
      <Path d="M22 28H34M28 22V34" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  hsse: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Path d="M32 10L18 18V30C18 40 24 48 32 52C40 48 46 40 46 30V18L32 10Z" fill="#f59e0b" opacity="0.1"/>
      <Path d="M32 10L18 18V30C18 40 24 48 32 52C40 48 46 40 46 30V18L32 10Z" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" fill="none"/>
      <Path d="M24 30L30 36L40 26" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="32" cy="32" r="3" fill="#f59e0b"/>
    </Svg>
  ),

  s0: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="10" y="16" width="44" height="32" rx="4" fill="#ec4899" opacity="0.1"/>
      <Rect x="10" y="16" width="44" height="32" rx="4" stroke="#ec4899" strokeWidth="2" fill="none"/>
      <Path d="M20 28C20 26 21 24 24 24C27 24 28 26 28 28C28 30 26 31 24 32C22 33 20 34 20 36H28" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="44" cy="32" r="6" stroke="#ec4899" strokeWidth="2" fill="none"/>
      <Path d="M44 26V38M38 32H50" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  security_tool: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="14" y="20" width="36" height="28" rx="3" fill="#06b6d4" opacity="0.1"/>
      <Rect x="14" y="20" width="36" height="28" rx="3" stroke="#06b6d4" strokeWidth="2" fill="none"/>
      <Rect x="28" y="12" width="8" height="8" rx="1" fill="#06b6d4" opacity="0.2"/>
      <Rect x="28" y="12" width="8" height="8" rx="1" stroke="#06b6d4" strokeWidth="2" fill="none"/>
      <Circle cx="32" cy="32" r="6" stroke="#06b6d4" strokeWidth="2" fill="none"/>
      <Circle cx="32" cy="32" r="2" fill="#06b6d4"/>
      <Path d="M32 38V42" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  training: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="12" y="18" width="40" height="30" rx="2" fill="#14b8a6" opacity="0.1"/>
      <Rect x="12" y="18" width="40" height="30" rx="2" stroke="#14b8a6" strokeWidth="2" fill="none"/>
      <Path d="M12 26H52" stroke="#14b8a6" strokeWidth="2"/>
      <Circle cx="22" cy="36" r="4" fill="#14b8a6" opacity="0.3"/>
      <Circle cx="22" cy="36" r="4" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
      <Path d="M28 34H46M28 38H42" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M32 10L28 14L32 18" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M36 14H32" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  violation: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Circle cx="32" cy="32" r="20" fill="#dc2626" opacity="0.1"/>
      <Circle cx="32" cy="32" r="20" stroke="#dc2626" strokeWidth="2" fill="none"/>
      <Path d="M22 22L42 42M42 22L22 42" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
      <Path d="M32 12V8M32 56V52M52 32H56M8 32H12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  construction: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="14" y="10" width="36" height="44" rx="3" fill="#f97316" opacity="0.1"/>
      <Rect x="14" y="10" width="36" height="44" rx="3" stroke="#f97316" strokeWidth="2" fill="none"/>
      <Path d="M24 20H40" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      <Rect x="22" y="28" width="8" height="8" stroke="#f97316" strokeWidth="2" fill="none"/>
      <Path d="M24 32H28M26 30V34" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M34 30H42M34 34H42" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      <Rect x="22" y="40" width="20" height="8" rx="1" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1.5"/>
    </Svg>
  ),

  report: (props) => (
    <Svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" {...props}>
      <Rect x="16" y="12" width="32" height="40" rx="2" fill="#6366f1" opacity="0.1"/>
      <Rect x="16" y="12" width="32" height="40" rx="2" stroke="#6366f1" strokeWidth="2" fill="none"/>
      <Path d="M24 20H40M24 28H40M24 36H36" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
      <Rect x="24" y="42" width="16" height="6" rx="1" fill="#6366f1" opacity="0.3"/>
      <Path d="M28 18V10L32 14L36 10V18" fill="#6366f1" opacity="0.2" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
    </Svg>
  ),
};

// Mapping từ path/key sang icon component
export const ICON_MAP = {
  'Thực hiện Checklist': MenuIcons.checklist,
  'checklist': MenuIcons.checklist,
  
  'Checklist Lại': MenuIcons.recheck,
  'recheck': MenuIcons.recheck,
  
  'Xử lý sự cố': MenuIcons.incident,
  'incident': MenuIcons.incident,
  
  'Tra cứu': MenuIcons.lookup,
  'lookup': MenuIcons.lookup,
  
  'Báo cáo HSSE': MenuIcons.hsse,
  'hsse': MenuIcons.hsse,
  
  'Báo cáo S0': MenuIcons.s0,
  's0': MenuIcons.s0,
  
  'an_ninh_cong_cu': MenuIcons.security_tool,
  'security_tool': MenuIcons.security_tool,
  
  'an_ninh_dao_tao': MenuIcons.training,
  'training': MenuIcons.training,
  
  'an_ninh_vi_pham': MenuIcons.violation,
  'violation': MenuIcons.violation,
  
  'Đăng ký thi công': MenuIcons.construction,
  'construction': MenuIcons.construction,
  
  'Báo cáo': MenuIcons.report,
  'report': MenuIcons.report,
};

// Helper function để lấy icon
export const getIcon = (key, props = {}) => {
  const IconComponent = ICON_MAP[key];
  return IconComponent ? <IconComponent {...props} /> : null;
};