import { IDocument } from '@models/index';

export interface IScocialMedia {
	name?: string;
	url?: string;
	icon?: string;
}

export interface IScocialTitle {
	name?: string;
	icon?: string;
}

export interface ISiteOwnerContact {
	address?: {
		short?: string;
		full?: string;
		lonlat?: string;
	};
	email?: string;
	phone?: string;
	website?: string;
}

export interface ISiteOwnerInfo {
	about?: {
		title?: string;
		short?: string;
		full?: string;
		imageUrl?: string;
		videoUrl?: string;
	};
	titles?: Array<IScocialTitle>;
}

export interface ISiteOwner {
	firstName?: string;
	lastName?: string;
	fullName?: string;
	birthDate?: string;
	info?: ISiteOwnerInfo;
	contacts?: ISiteOwnerContact;
	socialMedias?: Array<IScocialMedia>;
}

export interface ISiteSection {
	key: string;
	name: string;
	isVisible: boolean;
}

export interface ISiteLogo {
	imageUrl?: string;
	text?: string;
}

export interface ISite extends IDocument {
	owner?: ISiteOwner;
	logo?: ISiteLogo;
	// sections?: Array<ISiteSection>;
}

export const SiteInjectionKeys = { siteKey: Symbol(), ownerKey: Symbol(), logoKey: Symbol(), sectionKey: Symbol(), sectionsKey: Symbol() };

export type TSiteOwner = { getSiteOwner: ISiteOwner; isSiteOwner: boolean };
export type TSiteLogo = { getSiteLogo: ISiteLogo; isSiteLogo: boolean };

export const InitialSiteLogoData: ISiteLogo = { text: '', imageUrl: '' };
export const InitialSiteOwnerData: ISiteOwner = {
	firstName: undefined,
	lastName: undefined,
	fullName: undefined,
	birthDate: undefined,
	info: { about: { title: undefined, short: undefined, full: undefined, imageUrl: undefined, videoUrl: undefined }, titles: [{ name: '', icon: '' }] },
	contacts: { address: { short: '', full: '', lonlat: '' }, email: '', phone: '', website: '' },
	socialMedias: [{ name: '', url: '', icon: '' }]
};
export const InitialSiteSectionData: ISiteSection[] = [{ key: '', name: '', isVisible: false }];
export const InitialSiteData: ISite = {
	id: '',
	createdAt: Date.now().toString(),
	updatedAt: Date.now().toString(),
	logo: { ...InitialSiteLogoData },
	owner: { ...InitialSiteOwnerData },
	// sections: [...InitialSiteSectionData]
};