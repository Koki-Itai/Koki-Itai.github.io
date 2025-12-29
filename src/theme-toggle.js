/**
 * テーマ切り替え機能
 * ライト/ダークテーマをトグルし、ローカルストレージに設定を保存します。
 */

(function() {
  const THEME_KEY = 'theme-preference';
  
  // システムのテーマ設定を取得
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // 保存されたテーマを取得（なければシステム設定を使用）
  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
  }
  
  // テーマを適用
  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // 'system' の場合はdata-theme属性を削除してCSSのメディアクエリに任せる
      root.removeAttribute('data-theme');
    }
    
    updateToggleButton(theme);
  }
  
  // トグルボタンの表示を更新
  function updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    
    // 実際に表示されているテーマを判定
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    
    if (effectiveTheme === 'dark') {
      button.classList.add('dark-mode');
      button.setAttribute('aria-label', 'ライトモードに切り替え');
    } else {
      button.classList.remove('dark-mode');
      button.setAttribute('aria-label', 'ダークモードに切り替え');
    }
  }
  
  // テーマを切り替え
  function toggleTheme() {
    const savedTheme = getSavedTheme();
    const currentEffectiveTheme = savedTheme || getSystemTheme();
    
    // 現在の実効テーマの反対に切り替え
    const newTheme = currentEffectiveTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }
  
  // 初期化
  function init() {
    const savedTheme = getSavedTheme();
    
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // 保存されたテーマがない場合はシステム設定に従う
      applyTheme('system');
    }
    
    // トグルボタンのイベントリスナーを設定
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
    
    // システムテーマの変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const savedTheme = getSavedTheme();
      if (!savedTheme) {
        // 手動設定がない場合のみシステムテーマに追従
        updateToggleButton('system');
      }
    });
  }
  
  // DOMContentLoadedで初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

