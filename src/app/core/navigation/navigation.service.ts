import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { User } from '../user/user.types';
import { UserService } from '../user/user.service';

const defaultNavigation: FuseNavigationItem[] = [
    {
        id:'home',
        title: 'Accueil',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home'
    },
    {
        id   : 'dashboards',
        title: 'Dashboards',
        type : 'group',
        icon : 'heroicons_outline:home',
        children: [
            {
                id: 'dashboard.commandes',
                title: 'Commandes',
                type: 'basic',
                icon: 'heroicons_outline:shopping-cart',
                link: '/dashboards/commandes'
            },
            {
                id: 'dashboard.facures',
                title: 'Factures',
                type: 'basic',
                icon: 'heroicons_outline:document-text',
                link: '/dashboards/factures'
            }
        ]
    }
];

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    user: User;

    constructor(private _userService: UserService) {}
        

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._userService.user$.pipe(
            switchMap((user: User) => {
                // Clone the default navigation to avoid mutating the original
                const navigation = JSON.parse(JSON.stringify(defaultNavigation));
        
                if (user.role === 'admin') {
                    // Add the dashboard.clients item if the user is an admin
                    navigation[1].children.push({
                        id: 'dashboard.clients',
                        title: 'Clients',
                        type: 'basic',
                        icon: 'heroicons_outline:user-group',
                        link: '/dashboards/clients'
                    });
                }
        
                const navigationData: Navigation = {
                    compact: navigation,
                    default: navigation,
                    futuristic: navigation,
                    horizontal: navigation,
                };
        
                // Emit the navigation data to the _navigation ReplaySubject
                this._navigation.next(navigationData);
        
                // Return the navigation data as an Observable
                return of(navigationData);
            })
        );
        
    }
}
