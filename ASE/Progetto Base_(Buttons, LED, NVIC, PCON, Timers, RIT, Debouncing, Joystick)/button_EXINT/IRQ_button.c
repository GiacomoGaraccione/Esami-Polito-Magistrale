#include "button.h"
#include "lpc17xx.h"

extern int down_int0;
extern int down_key1;
extern int down_key2;

void EINT0_IRQHandler (void)	  	/* INT0														 */
{		
	//debouncing da controllare quando ha senso farlo (pressione aggiunge valori ad una variabile, situazioni in cui avere ripetute pressioni non volute porta a comportamenti sbagliati)
	NVIC_DisableIRQ(EINT0_IRQn);		/* disable Button interrupts			 */
	LPC_PINCON->PINSEL4    &= ~(1 << 20);     /* GPIO pin selection */
	down_int0=1;
	LPC_SC->EXTINT &= (1 << 0);     /* clear pending interrupt         */
}


void EINT1_IRQHandler (void)	  	/* KEY1														 */
{
	NVIC_DisableIRQ(EINT1_IRQn);		/* disable Button interrupts			 */
	LPC_PINCON->PINSEL4    &= ~(1 << 22);     /* GPIO pin selection */
	down_key1=1;
	LPC_SC->EXTINT &= (1 << 1);     /* clear pending interrupt         */
}

void EINT2_IRQHandler (void)	  	/* KEY2														 */
{
	NVIC_DisableIRQ(EINT2_IRQn);		/* disable Button interrupts			 */
	LPC_PINCON->PINSEL4    &= ~(1 << 24);     /* GPIO pin selection */
	down_key2=1;
  LPC_SC->EXTINT &= (1 << 2);     /* clear pending interrupt         */    
}


