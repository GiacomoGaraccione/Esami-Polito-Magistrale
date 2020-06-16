
;template base per una funzione assembly da inserire nel codice ARM
;va inserita nella stessa cartella del modulo che andrà a richiamarla (RIT se chiamata da pressione di Select, Timer se deve scattare al termine di un timer, ...)
;nel file .c che la richiama va dichiarata come "extern unsigned int funct(lista parametri)
;se il numero di registri da usare è basso usare magari quelli volatili

				AREA asm_functions, CODE, READONLY				
                EXPORT  overflow
overflow
				; save current SP for a faster access 
				; to parameters in the stack
				MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
				; extract argument 4 and 5 into R4 and R5
				;LDR   r4, [r12]
				;LDR   r5, [r12,#4]
				; setup a value for R0 to return
				;MOV	  r0, r5
				
				;r0 contiene l'indirizzo in cui è contenuto il vettore, r1 la sua dimensione
				mov r4, #0        ;registro usato per scorrere il vettore e confrontato con r1
				ldr r5, [r0]     ;caricamento di un elemento del vettore
loop			ldr r6, [r0, #4] ;caricamento dell'elemento successivo
				add r5, r5, r6
				bvs ret0         ;salta se la somma ha messo l'overflow flag V a 1
				bcs ret1         ;salta se la somma ha messo il carry flag C a 1
				
				add r4, r4, #1    ;aumento valore di scorrimento
				add r0, r0, #4    ;aumento indice del vettore
				cmp r4, r1
				bne loop
				mov r0, #2
				b fine
				
ret0            mov r0, #0
                b fine
				
ret1            mov r0, #1
                b fine
				
				
				; restore volatile registers
fine     		LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END