/*----------------------------------------------------------------------------
 * Name:    sample.c
 * Purpose: to control led through EINT and joystick buttons
 * Note(s):
 *----------------------------------------------------------------------------
 *
 * This software is supplied "AS IS" without warranties of any kind.
 *
 * Copyright (c) 2017 Politecnico di Torino. All rights reserved.
 *----------------------------------------------------------------------------*/
                  
#include <stdio.h>
#include "LPC17xx.H"                    /* LPC17xx definitions                */
#include "led/led.h"
#include "button_EXINT/button.h"
#include "timer/timer.h"
#include "RIT/RIT.h"
#include "joystick/joystick.h"

/*----------------------------------------------------------------------------
  Main Program
 *----------------------------------------------------------------------------*/
int main (void) {
  	
	SystemInit();  												/* System Initialization (i.e., PLL)  */
  LED_init();                           /* LED Initialization                 */
  BUTTON_init();												/* BUTTON Initialization              */
	joystick_init();											/* Joystick Initialization            */
	init_RIT(0x004C4B40);									/* RIT Initialization 50 msec       	*/
	enable_RIT();													/* RIT enabled												*/
	
	//init_timer(0, k);   k = f(in Hz) * t(in sec) = 25000000 Hz * t
	//enable_timer(0);
	
	
	LPC_SC->PCON |= 0x1;									/* power-down	mode										*/
	LPC_SC->PCON &= ~(0x2);						
		
  while (1) {                           /* Loop forever                       */	
		__ASM("wfi");
  }

}
