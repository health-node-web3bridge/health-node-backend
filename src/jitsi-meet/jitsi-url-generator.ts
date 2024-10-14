export class JitsiUrlGenerator {
    private domain: string;
    private roomName: string;
    private paramGroups: Record<string, Record<string, any>>;
    private jwtToken?: string;

    constructor(domain: string, roomName: string) {
        this.domain = domain || 'meet.jit.si';
        this.roomName = roomName;
        this.paramGroups = defaultParamGroups;
    }

    // Helper function to flatten the parameters with group names
    private flattenParamGroup(groupName: string, group: Record<string, any>): string[] {
        return Object.keys(group).map(key => {
            const value = typeof group[key] === 'object' ? JSON.stringify(group[key]) : group[key];
            return `${encodeURIComponent(groupName)}.${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        });
    }

    // Generate the URL with both query and hash params
    private generateUrl(): string {
        if (!this.domain || !this.roomName) {
            return '';
        }

        let params: string[] = [];
        for (const [groupName, group] of Object.entries(this.paramGroups)) {
            params = params.concat(this.flattenParamGroup(groupName, group));
        }

        // Construct the base URL
        let url = `https://${this.domain}/${this.roomName}`;

        // Append the params as hash (after the # symbol)
        if (params.length > 0) {
            url += `#${params.join('&')}`;
        }

        // Append the JWT token as a query parameter if present
        if (this.jwtToken) {
            const urlObject = new URL(url);
            urlObject.searchParams.set('jwt', this.jwtToken);
            url = urlObject.toString();
        }

        return url;
    }

    public getUrl(): string {
        return this.generateUrl();
    }

    // Add JWT token method
    public updateUserInfo(name: string, email: string): this {
        const userInfo = { displayName: name, email };
        this.paramGroups['userInfo'] = { ...userInfo };
        return this;
    }

    // Add JWT token method
    public addJwtToken(token: string): this {
        this.jwtToken = token;
        return this;
    }

    // Update or add parameter group (e.g., userInfo, config, interfaceConfig)
    public updateParamGroup(groupName: string, params: Record<string, any>): this {
        this.paramGroups[groupName] = params;
        return this;
    }
}

//https://shawnchin.github.io/jitsi-url-generator/
//https://github.com/jitsi/jitsi-meet/blob/master/config.js
//https://github.com/jitsi/jitsi-meet/blob/master/react/features/base/config/configWhitelist.ts
const defaultParamGroups = {
    userInfo: {
        displayName: 'displayName',
        email: 'user@mail.com',
    },
    config: {
        prejoinConfig: { enabled: false },
        startAudioOnly: true,
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        faceLandmarks: { enableFaceCentering: false },
        disableTileEnlargement: true,
        disableInitialGUM: true,
        disableModeratorIndicator: true,
        toolbarButtons: [
            'microphone',
            'camera',
            'chat',
            'raisehand',
            'participants-pane',
            'tileview',
            'settings',
            'download',
            'desktop',
            'hangup',
            // 'recording',
        ],
    },
    interfaceConfig: {
        VERTICAL_FILMSTRIP: false,
        DEFAULT_BACKGROUND: '#336699',
    },
};
