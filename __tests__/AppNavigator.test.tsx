import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';

import AppNavigator from '../AppNavigator';

describe('Testing react navigation', () => {
    jest.useFakeTimers();
    test('page contains the header and 10 items', async () => {
        const component = (
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        );

        render(component);

        act(() => jest.runAllTimers());

        const header = await screen.findByText('List of numbers from 1 to 20');
        const items = await screen.findAllByText(/Item number/);
        expect(header).toBeOnTheScreen();
        expect(items.length).toBe(10);
    });

    test('clicking on one item takes you to the details screen', async () => {
        const component = (
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        );

        render(component);

        
        act(() => jest.runAllTimers());
 
        const toClick = await screen.findByText('Item number 5');

        fireEvent(toClick, 'press');
        const newHeader = await screen.findByText('Showing details for 5');
        const newBody = await screen.findByText('the number you have chosen is 5');

        expect(newHeader).toBeOnTheScreen();
        expect(newBody).toBeOnTheScreen();
    });
});