
				AREA asm_functions, CODE, READONLY				
                EXPORT  count_bits_to_1
count_bits_to_1
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
				
				mov r1, #32 ;valore di controllo per il ciclo
				mov r2, #0  ;valore di scorrimento del numero, confrontato con r1
				mov r3, #1  ;valore usato per l'AND logico con r0(VAR1) 
				mov r4, #0  ;registro usato per contenere il risultato dell'AND e confrontato poi con r3
				mov r5, #0  ;usato per contare il numero di bit a 1, incrementato di volta in volta
				
loop			and r4, r0, r3
				cmp r4, r3
				addeq r5, r5, #1 ;incrementa il numero di bit posti a 1
				
				add r2, r2, #1
				lsr r0, r0, #1
				cmp r1, r2
				bne loop
				beq fine
				
fine			mov r0, r5
				; restore volatile registers
     			LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END