export interface MyfxbookAccount {
    id: number;
    name: string;
    description: string;
    accountId: number;
    gain: number;
    absGain: number;
    daily: string;
    monthly: string;
    withdrawals: number;
    deposits: number;
    interest: number;
    profit: number;
    balance: number;
    drawdown: number;
    equity: number;
    equityPercent: number;
    demo: boolean;
    lastUpdateDate: string;
    creationDate: string;
    firstTradeDate: string;
    tracking: number;
    views: number;
    commission: number;
    currency: string;
    profitFactor: number;
    pips: number;
    invitationUrl: string;
}

export interface MyfxbookMyAccountsResponse {
    error: boolean;
    message: string;
    accounts: MyfxbookAccount[];
}

export interface MyfxbookLoginResponse {
    error: boolean;
    message: string;
    session: string;
}
