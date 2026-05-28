import { LitElement, html, css } from 'https://esm.sh/lit@3.1.4';

class DoorlockCard extends LitElement {
  static get properties() {
    return {
      _hass: { type: Object, state: true },
      _config: { type: Object, state: true },
      _callActive: { type: Boolean, state: true },
      _callAnswered: { type: Boolean, state: true },
      _callPopupDismissed: { type: Boolean, state: true },
      _displayName: { type: String, state: true },
      _targetIp: { type: String, state: true },
      _floorLabel: { type: String, state: true },
      _positionDetail: { type: String, state: true },
      _showCallPopup: { type: Boolean, state: true },
      _showIntercomPopup: { type: Boolean, state: true },
      _showCallHistory: { type: Boolean, state: true },
      _showMonitorSelector: { type: Boolean, state: true },
      _showMonitorVideo: { type: Boolean, state: true },
      _monitorTargetIp: { type: String, state: true },
      _devices: { type: Array, state: true },
      _buildingName: { type: String, state: true },
      _dialInput: { type: String, state: true },
      _callHistory: { type: Array, state: true },
      _cameraUrl: { type: String, state: true },
      _entityMissing: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --doorlock-green: #34d399;
        --doorlock-red: #f87171;
        --doorlock-blue: #60a5fa;
        --doorlock-gray: #6b7280;
        --doorlock-bg: #0f172a;
        --doorlock-card-bg: rgba(30, 41, 59, 0.7);
        --doorlock-glass: rgba(255, 255, 255, 0.06);
        --doorlock-border: rgba(255, 255, 255, 0.08);
      }

      .card {
        background: var(--doorlock-card-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--doorlock-border);
        border-radius: 20px;
        overflow: hidden;
        color: #f1f5f9;
      }

      /* Header */
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px 14px;
        border-bottom: 1px solid var(--doorlock-border);
      }
      .card-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .card-title-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #34d399 0%, #059669 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
      .card-title-text {
        font-size: 15px;
        font-weight: 600;
        color: #f1f5f9;
      }
      .card-title-sub {
        font-size: 11px;
        color: #94a3b8;
        margin-top: 1px;
      }
      .status-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        color: #94a3b8;
      }
      .status-badge.active {
        background: rgba(248, 113, 113, 0.15);
        border-color: rgba(248, 113, 113, 0.3);
        color: #f87171;
      }
      .status-badge.answered {
        background: rgba(52, 211, 153, 0.15);
        border-color: rgba(52, 211, 153, 0.3);
        color: #34d399;
      }
      .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #6b7280;
      }
      .status-badge.active .status-dot {
        background: #f87171;
        animation: blink 1.2s ease-in-out infinite;
      }
      .status-badge.answered .status-dot {
        background: #34d399;
      }
      @keyframes blink {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }

      /* Main buttons */
      .main-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 16px 20px;
      }
      .main-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 20px 12px;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        color: #f1f5f9;
      }
      .main-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }
      .main-btn:active {
        transform: translateY(0);
      }
      .main-btn-icon {
        font-size: 28px;
        line-height: 1;
      }
      .main-btn-label {
        font-size: 13px;
        font-weight: 600;
        color: #e2e8f0;
      }

      /* Page content */
      .page-content {
        padding: 0 0 16px;
      }

      /* Entity missing warning */
      .entity-missing {
        padding: 24px 20px;
        text-align: center;
        color: #94a3b8;
      }
      .entity-missing-icon {
        font-size: 36px;
        margin-bottom: 12px;
      }
      .entity-missing-title {
        font-size: 15px;
        font-weight: 600;
        color: #fbbf24;
        margin-bottom: 6px;
      }
      .entity-missing-desc {
        font-size: 12px;
        color: #94a3b8;
        margin-bottom: 16px;
      }
      .entity-missing-desc code {
        background: rgba(255,255,255,0.06);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        color: #e2e8f0;
      }
      .entity-missing-steps {
        text-align: left;
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--doorlock-border);
        border-radius: 12px;
        padding: 14px 16px;
        font-size: 12px;
        line-height: 1.8;
        color: #94a3b8;
      }
      .entity-missing-steps b {
        color: #e2e8f0;
        font-weight: 500;
      }

      /* Dial pad */
      .dial-display {
        padding: 16px 20px 8px;
        text-align: center;
        font-size: 28px;
        font-weight: 600;
        color: #f1f5f9;
        min-height: 44px;
        letter-spacing: 4px;
        font-variant-numeric: tabular-nums;
      }
      .dial-pad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 0 16px 12px;
      }
      .dial-key {
        aspect-ratio: 1.3;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 12px;
        color: #f1f5f9;
        font-size: 20px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
      }
      .dial-key:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .dial-key:active {
        background: rgba(255, 255, 255, 0.05);
        transform: scale(0.95);
      }
      .dial-actions {
        display: flex;
        gap: 10px;
        padding: 0 16px 12px;
      }
      .dial-call-btn {
        flex: 1;
        padding: 14px;
        background: linear-gradient(135deg, #34d399 0%, #059669 100%);
        border: none;
        border-radius: 14px;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: inherit;
        transition: all 0.15s;
      }
      .dial-call-btn:active {
        transform: scale(0.97);
      }
      .dial-backspace {
        padding: 14px 18px;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 14px;
        color: #94a3b8;
        cursor: pointer;
        font-size: 16px;
        font-family: inherit;
        transition: all 0.15s;
      }
      .dial-backspace:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #f1f5f9;
      }
      .dial-backspace:active {
        transform: scale(0.95);
      }

      /* Property center button */
      .property-center-btn {
        margin: 0 16px 12px;
        padding: 12px;
        background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        border: none;
        border-radius: 14px;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: inherit;
        transition: all 0.15s;
      }
      .property-center-btn:active {
        transform: scale(0.97);
      }

      /* Recent calls */
      .recent-calls {
        margin-top: 4px;
        padding: 0 16px;
      }
      .recent-calls-title {
        font-size: 12px;
        color: #94a3b8;
        margin-bottom: 8px;
        font-weight: 500;
      }
      .call-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 12px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .call-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .call-item-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
      }
      .call-item-icon.incoming { background: rgba(96, 165, 250, 0.2); }
      .call-item-icon.outgoing { background: rgba(52, 211, 153, 0.2); }
      .call-item-icon.missed { background: rgba(248, 113, 113, 0.2); }
      .call-item-info {
        flex: 1;
        min-width: 0;
      }
      .call-item-name {
        font-size: 14px;
        font-weight: 500;
        color: #e2e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .call-item-time {
        font-size: 11px;
        color: #64748b;
        margin-top: 2px;
      }
      .call-item-redial {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        color: #34d399;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
        font-family: inherit;
        transition: all 0.15s;
      }
      .call-item-redial:hover {
        background: rgba(52, 211, 153, 0.2);
      }

      /* Door grid */
      .door-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        padding: 16px;
      }
      @media (max-width: 500px) {
        .door-grid { grid-template-columns: repeat(2, 1fr); }
      }

      /* Door item */
      .door-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 14px 8px;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        gap: 6px;
        min-height: 82px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .door-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
      }
      .door-btn:active {
        transform: translateY(0);
        background: rgba(255, 255, 255, 0.05);
      }
      .door-btn.current-call {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.35);
      }
      .door-btn-icon {
        font-size: 22px;
        margin-bottom: 2px;
      }
      .door-btn-name {
        font-size: 12px;
        font-weight: 600;
        color: #e2e8f0;
      }
      .door-btn-floor {
        font-size: 10px;
        color: #64748b;
        text-align: center;
        line-height: 1.2;
      }
      .door-btn.offline {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .door-btn.offline:hover {
        transform: none;
        background: var(--doorlock-glass);
      }
      .door-btn-floor-strip {
        width: 100%;
        height: 3px;
        border-radius: 2px;
        margin-bottom: 4px;
      }
      .floor-1 { background: #60a5fa; }
      .floor-2 { background: #818cf8; }
      .floor-b1 { background: #fbbf24; }
      .floor-b2 { background: #f97316; }

      /* Empty state */
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #64748b;
        font-size: 13px;
      }
      .empty-state-icon {
        font-size: 32px;
        margin-bottom: 8px;
        opacity: 0.5;
      }

      /* Intercom popup header override */
      .popup-header.intercom {
        background: rgba(96, 165, 250, 0.1);
        border-bottom-color: rgba(96, 165, 250, 0.2);
      }

      /* Intercom dial pad: 3x4 layout */
      .intercom-dial-pad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 0 16px 12px;
      }
      .intercom-dial-key {
        aspect-ratio: 1.6;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 12px;
        color: #f1f5f9;
        font-size: 20px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        padding: 0;
      }
      .intercom-dial-key:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .intercom-dial-key:active {
        background: rgba(255, 255, 255, 0.05);
        transform: scale(0.95);
      }
      .intercom-dial-key.property-center {
        font-size: 22px;
      }
      .intercom-dial-key.backspace {
        font-size: 18px;
        color: #94a3b8;
      }

      /* Call history toggle */
      .history-toggle {
        margin: 0 16px 12px;
        padding: 10px;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        border-radius: 12px;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: inherit;
        transition: all 0.15s;
      }
      .history-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #e2e8f0;
      }

      /* Popup overlay */
      .popup-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 9000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .popup {
        width: 100%;
        max-width: 400px;
        background: var(--doorlock-card-bg);
        border: 1px solid var(--doorlock-border);
        border-radius: 24px;
        overflow: hidden;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
        animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      @keyframes popupIn {
        from { opacity: 0; transform: scale(0.88); }
        to { opacity: 1; transform: scale(1); }
      }
      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: rgba(248, 113, 113, 0.1);
        border-bottom: 1px solid rgba(248, 113, 113, 0.2);
      }
      .popup-header.answered {
        background: rgba(52, 211, 153, 0.1);
        border-bottom-color: rgba(52, 211, 153, 0.2);
      }
      .popup-header-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .popup-calling-icon {
        width: 38px;
        height: 38px;
        background: rgba(248, 113, 113, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        animation: ring 1.2s ease-in-out infinite;
      }
      .popup-calling-icon.answered {
        background: rgba(52, 211, 153, 0.2);
        animation: none;
      }
      @keyframes ring {
        0%, 100% { transform: rotate(0deg); }
        20% { transform: rotate(-15deg); }
        40% { transform: rotate(15deg); }
        60% { transform: rotate(-10deg); }
        80% { transform: rotate(10deg); }
      }
      .popup-calling-label {
        font-size: 10px;
        color: #f87171;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .popup-calling-label.answered {
        color: #34d399;
      }
      .popup-device-name {
        font-size: 15px;
        font-weight: 600;
        color: #f1f5f9;
        margin-top: 2px;
      }
      .popup-device-location {
        font-size: 11px;
        color: #64748b;
        margin-top: 1px;
      }
      .popup-close {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--doorlock-glass);
        border: 1px solid var(--doorlock-border);
        color: #94a3b8;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s;
        font-family: inherit;
      }
      .popup-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #f1f5f9;
      }

      /* Video frame */
      .video-frame {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #000;
        position: relative;
        overflow: hidden;
      }
      .video-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .video-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        background: rgba(0, 0, 0, 0.3);
      }
      .video-spinner {
        width: 28px;
        height: 28px;
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-top-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Action buttons */
      .popup-actions {
        display: flex;
        gap: 10px;
        padding: 14px 16px 16px;
      }
      .popup-actions.two-btn {
        gap: 14px;
      }
      .action-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 14px 8px;
        border-radius: 14px;
        border: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.15s;
        font-family: inherit;
      }
      .action-btn:active {
        transform: scale(0.97);
      }
      .action-btn-icon {
        font-size: 22px;
        line-height: 1;
      }
      .action-btn.unlock {
        background: linear-gradient(135deg, #34d399 0%, #059669 100%);
        color: #fff;
        box-shadow: 0 4px 14px rgba(52, 211, 153, 0.35);
      }
      .action-btn.unlock:hover {
        box-shadow: 0 6px 20px rgba(52, 211, 153, 0.45);
      }
      .action-btn.answer {
        background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
        color: #fff;
        box-shadow: 0 4px 14px rgba(96, 165, 250, 0.35);
      }
      .action-btn.answer:hover {
        box-shadow: 0 6px 20px rgba(96, 165, 250, 0.45);
      }
      .action-btn.hangup {
        background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
        color: #fff;
        box-shadow: 0 4px 14px rgba(248, 113, 113, 0.35);
      }
      .action-btn.hangup:hover {
        box-shadow: 0 6px 20px rgba(248, 113, 113, 0.45);
      }
      .action-btn.stop {
        background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
        color: #fff;
        box-shadow: 0 4px 14px rgba(248, 113, 113, 0.35);
      }

      /* Monitor popup */
      .monitor-popup {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(6px);
        z-index: 9000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .monitor-popup-content {
        width: 100%;
        max-width: 520px;
        background: var(--doorlock-card-bg);
        border: 1px solid var(--doorlock-border);
        border-radius: 24px;
        overflow: hidden;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
        animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .monitor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 18px;
        background: rgba(96, 165, 250, 0.1);
        border-bottom: 1px solid rgba(96, 165, 250, 0.2);
      }
      .monitor-header-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .monitor-icon {
        width: 36px;
        height: 36px;
        background: rgba(96, 165, 250, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
      .monitor-title {
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
      }
      .monitor-subtitle {
        font-size: 11px;
        color: #64748b;
        margin-top: 1px;
      }
      .monitor-actions {
        display: flex;
        gap: 10px;
        padding: 14px 16px 16px;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    this._stopCameraRefresh();
    this._stopAudio();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('_showCallPopup') || changedProperties.has('_showMonitorVideo')) {
      if (this._showCallPopup || this._showMonitorVideo) {
        this._updateCameraImage();
        this._startCameraRefresh();
      } else {
        this._stopCameraRefresh();
      }
    }
  }

  setConfig(config) {
    this._config = config || {};
    this._dialInput = '';
    this._callHistory = [];
    this._showCallHistory = false;
    this._callAnswered = false;
    this._callPopupDismissed = false;
    this._showIntercomPopup = false;
    this._showMonitorSelector = false;
    this._showMonitorVideo = false;
    this._entityMissing = false;
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    this._loadState();
  }

  _loadState() {
    if (!this._hass) return;
    const entityId = 'binary_sensor.vds_call_status';
    const state = this._hass.states[entityId];
    if (!state) {
      console.warn('[DoorlockCard] 未找到实体:', entityId);
      this._entityMissing = true;
      return;
    }
    this._entityMissing = false;

    const a = state.attributes || {};
    const wasActive = this._callActive;

    this._callActive = state.state === 'on';

    if (this._callActive) {
      this._displayName = a.display_name || '';
      this._targetIp = a.target_ip || '';
      this._floorLabel = a.floor_label || '';
      this._positionDetail = a.position_detail || '';

      if (!wasActive) {
        // 新的呼入开始
        this._callAnswered = false;
        this._callPopupDismissed = false;
        this._showCallPopup = true;
        this._showMonitorSelector = false;
        this._showMonitorVideo = false;
        this._showIntercomPopup = false;
      } else if (!this._callPopupDismissed && !this._showMonitorSelector && !this._showMonitorVideo && !this._showIntercomPopup) {
        // 呼叫仍在进行，且用户没有手动关闭
        this._showCallPopup = true;
      }
    } else {
      // 呼叫结束
      if (wasActive && !this._callAnswered) {
        this._addToHistory({
          type: 'missed',
          name: this._displayName || '未知',
          number: '',
          time: new Date().toLocaleString('zh-CN'),
        });
      }
      this._callAnswered = false;
      this._callPopupDismissed = false;
      this._showCallPopup = false;
      this._stopAudio();
    }

    this._buildingName = a.building_name || '云海湾门禁';
    this._devices = a.devices || [];

    // 调试日志：在浏览器开发者工具 Console 中查看
    console.debug('[DoorlockCard] 状态更新:', {
      connection: a.connection_status,
      apiUrl: a.api_url,
      deviceCount: a.device_count,
      devices: this._devices,
    });
  }

  /* =============== Camera / Video =============== */

  _startCameraRefresh() {
    if (this._cameraInterval) return;
    this._cameraInterval = setInterval(() => this._updateCameraImage(), 500);
  }

  _stopCameraRefresh() {
    if (this._cameraInterval) {
      clearInterval(this._cameraInterval);
      this._cameraInterval = null;
    }
  }

  _updateCameraImage() {
    const cameraState = this._hass?.states['camera.uppercoast_doorlock_camera'];
    if (!cameraState) {
      this._cameraUrl = '';
      return;
    }
    const entityPicture = cameraState.attributes.entity_picture;
    if (!entityPicture) {
      this._cameraUrl = '';
      return;
    }
    this._cameraUrl = entityPicture + (entityPicture.includes('?') ? '&' : '?') + '_t=' + Date.now();
  }

  /* =============== Audio =============== */

  _initAudio() {
    if (this._audioCtx) return;
    this._audioCtx = new AudioContext();
    this._audioQueue = [];
    this._audioProcessor = this._audioCtx.createScriptProcessor(256, 0, 1);
    this._audioProcessor.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      if (this._audioQueue.length > 0) {
        const chunk = this._audioQueue.shift();
        const len = Math.min(output.length, chunk.length);
        for (let i = 0; i < len; i++) output[i] = chunk[i];
        for (let i = len; i < output.length; i++) output[i] = 0;
      } else {
        for (let i = 0; i < output.length; i++) output[i] = 0;
      }
    };
    this._audioProcessor.connect(this._audioCtx.destination);
  }

  _startAudio(targetIp) {
    if (!targetIp) return;
    this._initAudio();
    this._audioLastId = 0;
    this._audioQueue = [];
    this._startMicrophone(targetIp);
    this._audioPollInterval = setInterval(() => this._pollAudio(targetIp), 50);
  }

  _stopAudio() {
    if (this._audioPollInterval) {
      clearInterval(this._audioPollInterval);
      this._audioPollInterval = null;
    }
    this._stopMicrophone();
    this._audioQueue = [];
  }

  async _pollAudio(targetIp) {
    if (!this._hass || !targetIp) return;
    const token = this._getAuthToken();
    if (!token) return;
    try {
      const resp = await fetch(`/api/uppercoast_doorlock/audio?since=${this._audioLastId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (!data.ok) return;
      if (data.chunks && data.chunks.length > 0) {
        for (const chunk of data.chunks) {
          this._audioLastId = Math.max(this._audioLastId, chunk.id);
          this._queueAudio(chunk.pcm);
        }
      }
    } catch (e) {
      // ignore network errors
    }
  }

  _queueAudio(base64Pcm) {
    try {
      const binary = atob(base64Pcm);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }
      this._audioQueue.push(float32);
    } catch (e) {
      console.error('[DoorlockCard] Audio decode error:', e);
    }
  }

  async _startMicrophone(targetIp) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._micStream = stream;
      this._micCtx = new AudioContext();
      const source = this._micCtx.createMediaStreamSource(stream);
      this._micProcessor = this._micCtx.createScriptProcessor(4096, 1, 1);
      this._micProcessor.onaudioprocess = (e) => this._onAudioProcess(e, targetIp);
      source.connect(this._micProcessor);
      this._micProcessor.connect(this._micCtx.destination);
    } catch (e) {
      console.warn('[DoorlockCard] Microphone access denied:', e);
    }
  }

  _stopMicrophone() {
    if (this._micProcessor) {
      this._micProcessor.disconnect();
      this._micProcessor = null;
    }
    if (this._micStream) {
      this._micStream.getTracks().forEach((t) => t.stop());
      this._micStream = null;
    }
    if (this._micCtx) {
      this._micCtx.close();
      this._micCtx = null;
    }
  }

  _onAudioProcess(event, targetIp) {
    const input = event.inputBuffer.getChannelData(0);
    const sampleRate = this._micCtx.sampleRate;
    const ratio = sampleRate / 8000;
    const outputLength = Math.floor(input.length / ratio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      output[i] = input[Math.floor(i * ratio)];
    }
    const int16 = new Int16Array(output.length);
    for (let i = 0; i < output.length; i++) {
      const s = Math.max(-1, Math.min(1, output[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const uint8 = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const pcmBase64 = btoa(binary);
    this._sendAudioChunk(targetIp, pcmBase64);
  }

  async _sendAudioChunk(targetIp, pcmBase64) {
    const token = this._getAuthToken();
    if (!token || !targetIp) return;
    try {
      await fetch('/api/uppercoast_doorlock/audio', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target_ip: targetIp, pcm: pcmBase64 }),
      });
    } catch (e) {
      // ignore network errors
    }
  }

  _getAuthToken() {
    try {
      return this._hass.auth.data.access_token;
    } catch (e) {
      return '';
    }
  }

  /* =============== Helpers =============== */

  _getDoors() {
    return this._devices || [];
  }

  _getFloorColor(floorLabel) {
    if (!floorLabel) return 'floor-1';
    if (floorLabel.includes('1层') && !floorLabel.includes('-')) return 'floor-1';
    if (floorLabel.includes('2层')) return 'floor-2';
    if (floorLabel.includes('-1层')) return 'floor-b1';
    if (floorLabel.includes('-2层')) return 'floor-b2';
    return 'floor-1';
  }

  _getDoorStatus(targetIp) {
    if (!targetIp || !this._hass) return 'offline';
    const cameraState = this._hass.states['camera.uppercoast_doorlock_camera'];
    if (!cameraState) return 'offline';
    if (this._targetIp === targetIp && this._callActive) return 'current-call';
    return 'online';
  }

  _getDoorEmoji(displayName) {
    const emoji = { '1号机': '🚗', '2号机': '🌷', '3号机': '🚗', '4号机': '🚗', '5号机': '🚪', '6号机': '🚪', '7号机': '🚪', '8号机': '🏠' };
    return emoji[displayName] || '🚪';
  }

  _callService(service, data = {}) {
    if (!this._hass) return;
    this._hass.callService('uppercoast_doorlock', service, data);
  }

  /* =============== Call Actions =============== */

  _answerCall() {
    this._callAnswered = true;
    this._callService('answer', { target_ip: this._targetIp });
    this._startAudio(this._targetIp);
  }

  _hangupCall() {
    this._callService('hangup', { target_ip: this._targetIp });
    this._callAnswered = false;
    this._stopAudio();
    this._addToHistory({
      type: 'incoming',
      name: this._displayName || '未知',
      number: '',
      time: new Date().toLocaleString('zh-CN'),
    });
    this._showCallPopup = false;
  }

  _unlockDoor() {
    if (!this._callActive) return;
    this._callService('unlock', { target_ip: this._targetIp });
  }

  _dismissCallPopup() {
    this._showCallPopup = false;
    this._callPopupDismissed = true;
  }

  /* =============== Monitor Actions =============== */

  _openMonitorSelector() {
    this._showMonitorSelector = true;
    this._showMonitorVideo = false;
    this._showCallPopup = false;
    this._showIntercomPopup = false;
  }

  _startMonitor(targetIp) {
    this._monitorTargetIp = targetIp;
    this._showMonitorSelector = false;
    this._showMonitorVideo = true;
    this._callService('monitor_start', { target_ip: targetIp });
    this._startAudio(targetIp);
  }

  _stopMonitor() {
    this._stopAudio();
    if (this._monitorTargetIp) {
      this._callService('monitor_stop', { target_ip: this._monitorTargetIp });
    }
    this._showMonitorVideo = false;
    this._monitorTargetIp = '';
  }

  /* =============== Dial Actions =============== */

  _dial(key) {
    if (this._dialInput.length >= 4) return;
    this._dialInput += key;
  }

  _dialBackspace() {
    this._dialInput = this._dialInput.slice(0, -1);
  }

  _dialClear() {
    this._dialInput = '';
  }

  _makeCall() {
    const number = this._dialInput.trim();
    if (!number) return;

    // TODO: 需要 Addon 提供 /api/dial 端点用于呼叫其他房号
    // this._callService('dial', { number: number });

    this._addToHistory({
      type: 'outgoing',
      name: `房号 ${number}`,
      number: number,
      time: new Date().toLocaleString('zh-CN'),
    });

    this._dialInput = '';
  }

  _callPropertyCenter() {
    // TODO: 需要 Addon 提供物业中心机呼叫端点
    // this._callService('dial', { target: 'property_center' });

    this._addToHistory({
      type: 'outgoing',
      name: '物业中心',
      number: '物业中心',
      time: new Date().toLocaleString('zh-CN'),
    });
  }

  _addToHistory(entry) {
    if (!this._callHistory) this._callHistory = [];
    this._callHistory = [entry, ...this._callHistory].slice(0, 50);
  }

  /* =============== Render =============== */

  render() {
    const buildingName = this._buildingName || '云海湾门禁';

    if (this._entityMissing) {
      return html`
        <div class="card">
          ${this._renderHeader(buildingName)}
          <div class="entity-missing">
            <div class="entity-missing-icon">⚠️</div>
            <div class="entity-missing-title">Integration 未就绪</div>
            <div class="entity-missing-desc">
              未找到实体 <code>binary_sensor.vds_call_status</code>
            </div>
            <div class="entity-missing-steps">
              <div>1. 确认 Addon 已启动且日志显示「已加载门口机」</div>
              <div>2. 在 <b>设置 → 设备与服务</b> 中添加「虚拟门禁系统」Integration</div>
              <div>3. Host 必须填 <b>HA 主机的实际 IP</b>（不能填 localhost）</div>
              <div>4. 配置完成后重载 Integration 或重启 HA</div>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="card">
        ${this._renderHeader(buildingName)}
        ${this._renderMainButtons()}
      </div>
      ${this._showIntercomPopup ? this._renderIntercomPopup() : ''}
      ${this._showMonitorSelector ? this._renderMonitorSelector() : ''}
      ${this._showMonitorVideo ? this._renderMonitorVideoPopup() : ''}
      ${this._showCallPopup ? this._renderCallPopup() : ''}
    `;
  }

  _renderHeader(buildingName) {
    const statusText = this._callActive
      ? (this._callAnswered ? '通话中' : '呼叫中')
      : '待机';
    const statusClass = this._callActive
      ? (this._callAnswered ? 'answered' : 'active')
      : '';

    return html`
      <div class="card-header">
        <div class="card-title">
          <div class="card-title-icon">🏠</div>
          <div>
            <div class="card-title-text">云海湾门禁</div>
            <div class="card-title-sub">${buildingName}</div>
          </div>
        </div>
        <div class="status-badge ${statusClass}">
          <div class="status-dot"></div>
          ${statusText}
        </div>
      </div>
    `;
  }

  _renderMainButtons() {
    return html`
      <div class="main-buttons">
        <button class="main-btn" @click=${() => { this._showIntercomPopup = true; }}>
          <span class="main-btn-icon">📞</span>
          <span class="main-btn-label">对讲</span>
        </button>
        <button class="main-btn" @click=${this._openMonitorSelector}>
          <span class="main-btn-icon">📹</span>
          <span class="main-btn-label">监控</span>
        </button>
      </div>
    `;
  }

  /* =============== Intercom Popup =============== */

  _renderIntercomPopup() {
    const recentCalls = (this._callHistory || []).slice(0, 5);
    const iconMap = {
      incoming: { icon: '📥', cls: 'incoming' },
      outgoing: { icon: '📤', cls: 'outgoing' },
      missed: { icon: '❌', cls: 'missed' },
    };

    return html`
      <div class="popup-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._showIntercomPopup = false; }}>
        <div class="popup">
          <div class="popup-header intercom">
            <div class="popup-header-info">
              <div class="popup-calling-icon" style="animation:none;background:rgba(96,165,250,0.2);">📞</div>
              <div>
                <div class="popup-device-name">对讲</div>
                <div class="popup-device-location">${this._buildingName || '云海湾门禁'}</div>
              </div>
            </div>
            <button class="popup-close" @click=${() => this._showIntercomPopup = false}>✕</button>
          </div>

          <div class="page-content">
            <div class="dial-display">${this._dialInput || ' '}</div>
            <div class="intercom-dial-pad">
              ${['1','2','3','4','5','6','7','8','9'].map(key => html`
                <button class="intercom-dial-key" @click=${() => this._dial(key)}>${key}</button>
              `)}
              <button class="intercom-dial-key property-center" @click=${this._callPropertyCenter} title="物业中心机">👮</button>
              <button class="intercom-dial-key" @click=${() => this._dial('0')}>0</button>
              <button class="intercom-dial-key backspace" @click=${this._dialBackspace}>⌫</button>
            </div>
            <div class="dial-actions">
              <button class="dial-call-btn" @click=${this._makeCall}>
                <span style="font-size:18px;">📞</span>呼叫
              </button>
            </div>

            <button class="history-toggle" @click=${() => this._showCallHistory = !this._showCallHistory}>
              <span>${this._showCallHistory ? '▾' : '▸'}</span>
              ${this._showCallHistory ? '隐藏通话记录' : '显示通话记录'}
            </button>

            ${this._showCallHistory && recentCalls.length > 0 ? html`
              <div class="recent-calls">
                <div class="recent-calls-title">最近通话</div>
                ${recentCalls.map((call) => {
                  const info = iconMap[call.type] || iconMap.incoming;
                  const canRedial = call.number && call.number !== '物业中心';
                  return html`
                    <div class="call-item" @click=${() => {
                      if (canRedial) this._dialInput = call.number;
                    }}>
                      <div class="call-item-icon ${info.cls}">${info.icon}</div>
                      <div class="call-item-info">
                        <div class="call-item-name">${call.name}</div>
                        <div class="call-item-time">${call.time}</div>
                      </div>
                      ${canRedial ? html`
                        <button class="call-item-redial" @click=${(e) => {
                          e.stopPropagation();
                          this._dialInput = call.number;
                          this._makeCall();
                        }}>↻</button>
                      ` : ''}
                    </div>
                  `;
                })}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /* =============== Monitor Selector =============== */

  _renderMonitorSelector() {
    const doors = this._getDoors();

    return html`
      <div class="popup-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._showMonitorSelector = false; }}>
        <div class="popup" style="max-width:520px;">
          <div class="monitor-header">
            <div class="monitor-header-info">
              <div class="monitor-icon">📹</div>
              <div>
                <div class="monitor-title">选择监控号机</div>
                <div class="monitor-subtitle">${this._buildingName || '云海湾门禁'}</div>
              </div>
            </div>
            <button class="popup-close" @click=${() => this._showMonitorSelector = false}>✕</button>
          </div>

          ${!doors.length ? html`
            <div class="empty-state">
              <div class="empty-state-icon">📹</div>
              <div>暂无门口机数据</div>
              <div style="font-size:11px;margin-top:8px;line-height:1.6;">
                1. 确认 Addon 已启动<br/>
                2. 检查 Integration 配置的 host/port 是否正确<br/>
                3. 在浏览器 F12 → Console 查看调试信息
              </div>
            </div>
          ` : html`
            <div class="door-grid">
              ${doors.map((door) => {
                const status = this._getDoorStatus(door.target_ip);
                const isCurrentCall = status === 'current-call';
                const displayName = door.display_name || door.name || '';
                return html`
                  <div
                    class="door-btn ${status === 'offline' ? 'offline' : ''} ${isCurrentCall ? 'current-call' : ''}"
                    @click=${() => { if (status !== 'offline') this._startMonitor(door.target_ip); }}
                  >
                    <div class="door-btn-floor-strip ${this._getFloorColor(door.floor_label)}"></div>
                    <div class="door-btn-icon">${this._getDoorEmoji(displayName)}</div>
                    <div class="door-btn-name">${displayName}</div>
                    <div class="door-btn-floor">${door.floor_label || ''}</div>
                  </div>
                `;
              })}
            </div>
          `}
        </div>
      </div>
    `;
  }



  /* =============== Call Popup =============== */

  _renderCallPopup() {
    const answerBtn = this._callAnswered
      ? html`
        <button class="action-btn hangup" @click=${this._hangupCall}>
          <span class="action-btn-icon">📵</span>挂断
        </button>`
      : html`
        <button class="action-btn answer" @click=${this._answerCall}>
          <span class="action-btn-icon">📞</span>接听
        </button>`;

    const headerClass = this._callAnswered ? 'answered' : '';
    const iconClass = this._callAnswered ? 'answered' : '';
    const labelClass = this._callAnswered ? 'answered' : '';
    const labelText = this._callAnswered ? '通话中' : '呼入中';

    return html`
      <div class="popup-overlay" @click=${(e) => { if (e.target === e.currentTarget) this._dismissCallPopup(); }}>
        <div class="popup">
          <div class="popup-header ${headerClass}">
            <div class="popup-header-info">
              <div class="popup-calling-icon ${iconClass}">📞</div>
              <div>
                <div class="popup-calling-label ${labelClass}">${labelText}</div>
                <div class="popup-device-name">${this._displayName}</div>
                <div class="popup-device-location">${this._floorLabel || ''}</div>
              </div>
            </div>
            <button class="popup-close" @click=${this._dismissCallPopup}>✕</button>
          </div>

          <div class="video-frame">
            ${this._cameraUrl
              ? html`<img src="${this._cameraUrl}" alt="门禁视频" />`
              : html`
                <div class="video-overlay">
                  <div class="video-spinner"></div>
                  正在加载视频...
                </div>
              `}
          </div>

          <div class="popup-actions two-btn">
            <button class="action-btn unlock" @click=${this._unlockDoor}>
              <span class="action-btn-icon">🔓</span>解锁
            </button>
            ${answerBtn}
          </div>
        </div>
      </div>
    `;
  }

  /* =============== Monitor Video Popup =============== */

  _renderMonitorVideoPopup() {
    const door = this._getDoors().find(d => d.target_ip === this._monitorTargetIp) || {};
    const displayName = door.display_name || door.name || '监控中';

    return html`
      <div class="monitor-popup" @click=${(e) => { if (e.target === e.currentTarget) this._stopMonitor(); }}>
        <div class="monitor-popup-content">
          <div class="monitor-header">
            <div class="monitor-header-info">
              <div class="monitor-icon">📹</div>
              <div>
                <div class="monitor-title">${displayName}</div>
                <div class="monitor-subtitle">${door.floor_label || ''} · ${door.position_detail || ''}</div>
              </div>
            </div>
            <button class="popup-close" @click=${this._stopMonitor}>✕</button>
          </div>

          <div class="video-frame">
            ${this._cameraUrl
              ? html`<img src="${this._cameraUrl}" alt="监控画面" />`
              : html`
                <div class="video-overlay">
                  <div class="video-spinner"></div>
                  正在加载视频...
                </div>
              `}
          </div>

          <div class="monitor-actions">
            <button class="action-btn stop" @click=${this._stopMonitor}>
              <span class="action-btn-icon">📵</span>停止监控
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('doorlock-card', DoorlockCard);
