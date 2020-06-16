/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_timer.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    timer.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "timer.h"
#include "../led/led.h"

/******************************************************************************
** Function name:		Timer0_IRQHandler
**
** Descriptions:		Timer/Counter 0 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

void TIMER0_IRQHandler (void)
{
  //azioni da compiere una volta raggiunto il valore del timer
	/* static int i = 0; blinking del LED 0 con tempistica data dal timer 
	   if(i%2 == 0)
	     LED_On(0);  LED_Out(0x00); permettono il blinking di tutti i LED insieme 
	   else
	     LED_Off(0); LED_Out(0xff);
	   i++;
	   if(i>10000)
	     i=0;
	*/
	
  LPC_TIM0->IR = 1;			/* clear interrupt flag */
  return;
}


/******************************************************************************
** Function name:		Timer1_IRQHandler
**
** Descriptions:		Timer/Counter 1 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER1_IRQHandler (void)
{
	//action
  LPC_TIM1->IR = 1;			/* clear interrupt flag */
  return;
}

void TIMER2_IRQHandler(void){
	//action
	LPC_TIM2->IR = 1;
	return;
}

void TIMER3_IRQHandler(void){
	//action
	LPC_TIM3->IR = 1;
	return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
