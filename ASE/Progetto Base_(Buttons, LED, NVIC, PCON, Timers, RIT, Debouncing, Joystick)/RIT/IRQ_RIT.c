/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_RIT.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    RIT.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "RIT.h"
#include "../led/led.h"

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

volatile int down_int0=0;
volatile int down_key1=0;
volatile int down_key2=0;

void RIT_IRQHandler (void)
{					
	static int select=0; //variabili dichiarate come static conservano il loro valore tra le varie chiamate
	static int joystick_down = 0;
	static int joystick_left = 0;
	static int joystick_right = 0;
	static int joystick_up = 0;
	
	
	
	if((LPC_GPIO1->FIOPIN & (1<<25)) == 0){	/* Joystick Select pressed */
		select++; //indica il passaggio di 50ms durante i quali il Select è stato premuto
		switch(select){
			case 1: //caso in cui il tasto select è stato premuto per la prima volta
				//action
				break;
			/*case k: pressione prolungata del tasto select per un tempo dato  k = T (in sec)/50 ms
			    action
			  break*/
			default:
				break;
		}
	}
	else{
			select=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<26)) == 0){	/* Joystick Down pressed */
		joystick_down++; //indica il passaggio di 50ms durante i quali il tasto Down è stato premuto
		switch(joystick_down){
			case 1: //caso in cui il tasto Down è stato premuto per la prima volta
				//action
				break;
			/*case k: pressione prolungata del tasto per un tempo dato  k = T (in sec)/50 ms
			    action
			  break*/
			default:
				break;
		}
	}
	else{
			joystick_down=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<27)) == 0){	/* Joystick Left pressed */
		joystick_left++; //indica il passaggio di 50ms durante i quali il tasto Left è stato premuto
		switch(joystick_left){
			case 1: //caso in cui il tasto Left è stato premuto per la prima volta
				//action
				break;
			/*case k: pressione prolungata del tasto per un tempo dato  k = T (in sec)/50 ms
			    action
			  break*/
			default:
				break;
		}
	}
	else{
			joystick_left=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<28)) == 0){	/* Joystick Right pressed */
		joystick_right++; //indica il passaggio di 50ms durante i quali il tasto Right è stato premuto
		switch(joystick_right){
			case 1: //caso in cui il tasto Right è stato premuto per la prima volta
				//action
				break;
			/*case k: pressione prolungata del tasto per un tempo dato  k = T (in sec)/50 ms
			    action
			  break*/
			default:
				break;
		}
	}
	else{
			joystick_right=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	/* Joystick Up pressed */
		joystick_up++; //indica il passaggio di 50ms durante i quali il tasto Up è stato premuto
		switch(joystick_up){
			case 1: //caso in cui il tasto Up è stato premuto per la prima volta
				//action
				break;
			/*case k: pressione prolungata del tasto per un tempo dato  k = T (in sec)/50 ms
			    action
			  break*/
			default:
				break;
		}
	}
	else{
			joystick_up=0;
	}
	
	/* button management */
	
	if(down_int0!=0){ /* INT0 pressed */ //gestisce il debouncing del pulsante INT0
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){	
			down_int0++;				
			switch(down_int0){
				case 2:
					//azione
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_int0=0;			
			NVIC_EnableIRQ(EINT0_IRQn);							 /* enable Button interrupts			*/
			LPC_PINCON->PINSEL4    |= (1 << 20);     /* External interrupt 0 pin selection */
		}
	}
	
	if(down_key1!=0){ /* KEY1 pressed */ //gestisce il debouncing del pulsante KEY1
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){	
			down_key1++;				
			switch(down_key1){
				case 2:
					//azione
				  /* disable_timer(0);
				     var += LPC_TIM0->TC; aggiunta alla variabile var del valore di timer al momento della pressione del tasto
				     enable_timer(0); il timer viene fatto ripartire subito, se non specificato (altrimenti si può far partire a tasto rilasciato nel blocco else)
				  */
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_key1=0;				
			NVIC_EnableIRQ(EINT1_IRQn);							 /* enable Button interrupts			*/
			LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
		}
	}
	
	if(down_key2!=0){ /* KEY2 pressed */ //gestisce il debouncing del pulsante KEY2
		if((LPC_GPIO2->FIOPIN & (1<<12)) == 0){	
			down_key2++;				
			switch(down_key2){
				case 2:
					//azione
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_key2=0;			
			NVIC_EnableIRQ(EINT2_IRQn);							 /* enable Button interrupts			*/
			LPC_PINCON->PINSEL4    |= (1 << 24);     /* External interrupt 0 pin selection */
		}
	}
	
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
